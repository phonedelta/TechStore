<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalRevenue = Order::whereNotIn('status', ['cancelled'])->sum('total');
        $driver = DB::connection()->getDriverName();

        if ($driver === 'sqlite') {
            $salesByMonth = Order::select(
                DB::raw("strftime('%Y-%m', created_at) as month"),
                DB::raw('SUM(total) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
                ->whereNotIn('status', ['cancelled'])
                ->where('created_at', '>=', now()->subMonths(6))
                ->groupBy('month')
                ->orderBy('month')
                ->get();
        } else {
            $salesByMonth = Order::select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"),
                DB::raw('SUM(total) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
                ->whereNotIn('status', ['cancelled'])
                ->where('created_at', '>=', now()->subMonths(6))
                ->groupBy('month')
                ->orderBy('month')
                ->get();
        }

        return response()->json([
            'total_products' => Product::count(),
            'total_orders' => Order::count(),
            'total_revenue' => round((float) $totalRevenue, 2),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'completed_orders' => Order::where('status', 'delivered')->count(),
            'low_stock_products' => Product::where('stock', '<=', 10)->where('is_active', true)->count(),
            'unread_messages' => ContactMessage::where('is_read', false)->count(),
            'sales_by_month' => $salesByMonth,
            'orders_by_status' => Order::select('status', DB::raw('COUNT(*) as count'))
                ->groupBy('status')
                ->get(),
            'recent_orders' => Order::orderBy('created_at', 'desc')->limit(5)->get(),
            'low_stock' => Product::with('category')
                ->where('stock', '<=', 10)
                ->where('is_active', true)
                ->orderBy('stock')
                ->limit(8)
                ->get(),
        ]);
    }
}
