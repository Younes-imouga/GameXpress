<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    /**
     * Display a listing of the categories.
     */
    public function index(): JsonResponse
    {
        $categories = Category::with('children')
            ->whereNull('parent_id')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $categories
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories'],
            'parent_id' => ['nullable', 'exists:categories,id']
        ]);

        $category = Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'parent_id' => $request->parent_id
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Category created successfully',
            'data' => $category
        ], 201);
    }
    
    public function show(Category $category): JsonResponse
    {
        $category->load(['parent', 'children']);

        return response()->json([
            'status' => 'success',
            'data' => $category
        ]);
    }

    /**
     * Update the specified category.
     */
    public function update(Request $request, Category $category): JsonResponse
    {
        $request->validate([
            'name' => [
                'required', 
                'string', 
                'max:255',
                Rule::unique('categories')->ignore($category->id)
            ],
            'parent_id' => [
                'nullable',
                'exists:categories,id',
                function ($attribute, $value, $fail) use ($category) {
                    if ($value == $category->id) {
                        $fail('A category cannot be its own parent.');
                    }
                }
            ]
        ]);

        $category->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'parent_id' => $request->parent_id
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Category updated successfully',
            'data' => $category->fresh(['parent', 'children'])
        ]);
    }

    /**
     * Remove the specified category.
     */
    public function destroy(Category $category): JsonResponse
    {
        // Check if category has products
        if ($category->products()->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot delete category with associated products'
            ], 422);
        }

        // Move child categories to parent if exists
        if ($category->children()->exists()) {
            $category->children()->update([
                'parent_id' => $category->parent_id
            ]);
        }

        $category->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Category deleted successfully'
        ]);
    }
} 