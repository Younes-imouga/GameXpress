<?php

use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\Admin\RoleController;
use App\Http\Controllers\Api\V1\Admin\ProductController;
use App\Http\Controllers\Api\V1\Admin\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/v1/admin/register', [AuthController::class, 'register']);
Route::post('/v1/admin/login', [AuthController::class, 'login'])->name('login');
Route::post('/v1/admin/logout', [AuthController::class, 'logout']);

Route::prefix('v1/admin')->middleware(['auth:sanctum'])->group(function () {
    Route::middleware(['role:super_admin'])->group(function () {
        Route::get('/roles', [RoleController::class, 'index']);
        Route::post('/roles/assign', [RoleController::class, 'assignRole']);
        Route::post('/roles/remove', [RoleController::class, 'removeRole']);
    });
    
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware('permission:view_dashboard');
    
    Route::get('/products', [ProductController::class, 'index'])
        ->middleware('permission:view_products');
    
    Route::post('/products', [ProductController::class, 'store'])
        ->middleware('permission:create_products');
    
    Route::put('/products/{product}', [ProductController::class, 'update'])
        ->middleware('permission:edit_products');
    
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])
        ->middleware('permission:delete_products');

    Route::get('/categories', [CategoryController::class, 'index'])
        ->middleware('permission:view_categories');
        
    Route::post('/categories', [CategoryController::class, 'store'])
        ->middleware('permission:create_categories');
        
    Route::get('/categories/{category}', [CategoryController::class, 'show'])
        ->middleware('permission:view_categories');
        
    Route::put('/categories/{category}', [CategoryController::class, 'update'])
        ->middleware('permission:edit_categories');
        
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])
        ->middleware('permission:delete_categories');
});
