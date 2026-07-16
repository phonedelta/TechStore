<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\OrderInvoiceMail;
use App\Mail\OrderVerificationMail;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with('items')->orderBy('created_at', 'desc');

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_email', 'like', "%{$search}%");
            });
        }

        return response()->json($query->paginate(20));
    }

    public function show(Order $order)
    {
        return response()->json($order->load('items.product'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email'],
            'customer_phone' => ['required', 'string', 'max:50'],
            'shipping_address' => ['required', 'string', 'max:500'],
            'city' => ['required', 'string', 'max:100'],
            'country' => ['required', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:20'],
            'payment_method' => ['nullable', 'in:cash_on_delivery,card,stripe'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        try {
            $order = DB::transaction(function () use ($data) {
                $subtotal = 0;
                $lineItems = [];

                foreach ($data['items'] as $item) {
                    $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                    if (! $product->is_active) {
                        throw new \RuntimeException("Product {$product->name} is unavailable.");
                    }

                    if ($product->stock < $item['quantity']) {
                        throw new \RuntimeException("Insufficient stock for {$product->name}.");
                    }

                    $unitPrice = $product->final_price;
                    $totalPrice = round($unitPrice * $item['quantity'], 2);
                    $subtotal += $totalPrice;

                    $lineItems[] = [
                        'product' => $product,
                        'quantity' => $item['quantity'],
                        'unit_price' => $unitPrice,
                        'total_price' => $totalPrice,
                    ];
                }

                $shippingCost = 0;
                $tax = 0;

                foreach ($lineItems as $line) {
                    $product = $line['product'];
                    if (! $product->free_shipping) {
                        $shippingCost += (float) $product->shipping_cost * $line['quantity'];
                    }
                    $tax += $line['total_price'] * ((float) $product->tax_percent / 100);
                }

                $shippingCost = round($shippingCost, 2);
                $tax = round($tax, 2);
                $total = round($subtotal + $shippingCost + $tax, 2);
                $token = Str::random(64);

                $order = Order::create([
                    'order_number' => 'ORD-'.strtoupper(Str::random(8)),
                    'customer_name' => $data['customer_name'],
                    'customer_email' => $data['customer_email'],
                    'customer_phone' => $data['customer_phone'],
                    'shipping_address' => $data['shipping_address'],
                    'city' => $data['city'],
                    'country' => $data['country'],
                    'postal_code' => $data['postal_code'],
                    'subtotal' => $subtotal,
                    'shipping_cost' => $shippingCost,
                    'tax' => $tax,
                    'total' => $total,
                    'payment_method' => $data['payment_method'] ?? 'cash_on_delivery',
                    'status' => 'pending',
                    'verification_token' => $token,
                ]);

                foreach ($lineItems as $line) {
                    $order->items()->create([
                        'product_id' => $line['product']->id,
                        'product_name' => $line['product']->name,
                        'unit_price' => $line['unit_price'],
                        'quantity' => $line['quantity'],
                        'total_price' => $line['total_price'],
                    ]);

                    $line['product']->decrement('stock', $line['quantity']);
                }

                return $order->load('items');
            });

            $frontend = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173')), '/');
            $verifyUrl = $frontend.'/verify-order/'.$order->verification_token;

            try {
                Mail::to($order->customer_email)->send(
                    new OrderVerificationMail($order, $verifyUrl)
                );
                $emailSent = true;
            } catch (\Throwable $mailError) {
                report($mailError);
                $emailSent = false;
            }

            $payload = [
                'message' => $emailSent
                    ? 'Verification email sent. Please check your inbox to confirm your order.'
                    : 'Order created, but the verification email could not be sent. Please contact support.',
                'order_number' => $order->order_number,
                'customer_email' => $order->customer_email,
                'email_verification_required' => true,
                'email_sent' => $emailSent,
            ];

            // Only expose the link if sending failed (so the customer can still verify)
            if (! $emailSent) {
                $payload['verification_url'] = $verifyUrl;
            }

            return response()->json($payload, 201);
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function verify(string $token)
    {
        $order = Order::with('items')->where('verification_token', $token)->first();

        if (! $order) {
            return response()->json(['message' => 'Invalid or expired verification link.'], 404);
        }

        if ($order->isEmailVerified()) {
            return response()->json([
                'message' => 'Order already verified.',
                'already_verified' => true,
                'order' => $order,
            ]);
        }

        $order->update([
            'email_verified_at' => now(),
            'status' => 'processing',
        ]);

        if (! $order->invoice_sent_at) {
            Mail::to($order->customer_email)->send(new OrderInvoiceMail($order->fresh('items')));
            $order->update(['invoice_sent_at' => now()]);
        }

        return response()->json([
            'message' => 'Order verified successfully. Your invoice has been sent by email.',
            'order' => $order->fresh('items'),
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => ['required', 'in:pending,processing,shipped,delivered,cancelled'],
        ]);

        if ($data['status'] === 'cancelled' && $order->status !== 'cancelled') {
            DB::transaction(function () use ($order, $data) {
                foreach ($order->items as $item) {
                    if ($item->product_id) {
                        Product::where('id', $item->product_id)->increment('stock', $item->quantity);
                    }
                }
                $order->update($data);
            });
        } else {
            $order->update($data);
        }

        return response()->json($order->fresh()->load('items'));
    }
}
