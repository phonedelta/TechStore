<x-mail::message>
# Order confirmed — invoice attached

Hi {{ $order->customer_name }},

Your order **{{ $order->order_number }}** has been verified successfully.

Please find your tax invoice attached as a PDF.

| | |
|:--|--:|
| Subtotal | {{ number_format($order->subtotal, 2) }} MAD |
| Shipping | {{ (float) $order->shipping_cost == 0 ? 'Free' : number_format($order->shipping_cost, 2).' MAD' }} |
| Tax | {{ number_format($order->tax, 2) }} MAD |
| **Total** | **{{ number_format($order->total, 2) }} MAD** |

Thanks for choosing TechStore!<br>
{{ config('app.name') }}
</x-mail::message>
