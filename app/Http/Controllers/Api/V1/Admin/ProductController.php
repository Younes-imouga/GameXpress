<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = Product::with(['category', 'images'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => $products
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'status' => ['required', 'in:available,out_of_stock'],
            'category_id' => ['required', 'exists:categories,id'],
            'images' => ['required', 'array', 'min:1'],
            'image.*' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        $product = Product::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'price' => $request->price,
            'stock' => $request->stock,
            'status' => $request->status,
            'category_id' => $request->category_id,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('products', 'public');
                
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => $path,
                    'is_primary' => $index === 0,
                ]);
            }
        }

        $product->load(['category', 'images']);

        return response()->json([
            'status' => 'success',
            'message' => 'Product created successfully',
            'data' => $product
        ], 201);
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, Product $product): JsonResponse
    {
        $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'stock' => ['sometimes', 'required', 'integer', 'min:0'],
            'status' => ['sometimes', 'required', 'in:available,out_of_stock'],
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'images' => ['sometimes', 'required', 'array', 'min:1'],
            'images.*' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
            'delete_images' => ['sometimes', 'array'],
            'delete_images.*' => ['required', 'exists:product_images,id'],
        ]);

        // Update product details
        if ($request->has('name')) {
            $product->name = $request->name;
            $product->slug = Str::slug($request->name);
        }
        
        $product->fill($request->only([
            'price',
            'stock',
            'status',
            'category_id',
        ]));

        $product->save();

        // Handle image deletions if requested
        if ($request->has('delete_images')) {
            $imagesToDelete = ProductImage::whereIn('id', $request->delete_images)
                ->where('product_id', $product->id)
                ->get();

            foreach ($imagesToDelete as $image) {
                Storage::disk('public')->delete($image->image_url);
                $image->delete();
            }
        }

        // Handle new image uploads
        if ($request->hasFile('images')) {
            $hasPrimaryImage = $product->images()->where('is_primary', true)->exists();
            
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('products', 'public');
                
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => $path,
                    'is_primary' => !$hasPrimaryImage && $index === 0,
                ]);
            }
        }

        // Load relationships for response
        $product->load(['category', 'images']);

        return response()->json([
            'status' => 'success',
            'message' => 'Product updated successfully',
            'data' => $product
        ]);
    }

    /**
     * Remove the specified product.
     */
    public function destroy(Product $product): JsonResponse
    {
        // Delete associated images from storage
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image_url);
        }

        // Delete the product (will cascade delete images due to foreign key)
        $product->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Product deleted successfully'
        ]);
    }
} 