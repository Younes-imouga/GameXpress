<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $statistics = [
            'total_products' => Product::count(),
            'total_users' => User::count(),
            'total_categories' => Category::count(),
            'low_stock_products' => Product::where('stock', '<=', 10)->count(),
            'out_of_stock_products' => Product::where('stock', 0)->count(),
            'recent_products' => Product::latest()->take(5)->get(),
            'stock_alerts' => Product::where('stock', '<=', 10)
                ->select('id', 'name', 'stock')
                ->get()
        ];

        return response()->json([
            'status' => 'success',
            'data' => $statistics
        ]);
    }

} 