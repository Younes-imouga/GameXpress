<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\JsonResponse;

class RoleController extends Controller
{
    public function index(): JsonResponse
    {
        $roles = Role::with('permissions')->get();
        return response()->json(['data' => $roles]);
    }

    public function assignRole(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|exists:roles,name',
        ]);

        $user = \App\Models\User::findOrFail($request->user_id);
        $user->assignRole($request->role);

        return response()->json([
            'message' => 'Role assigned successfully',
            'user' => $user->load('roles')
        ]);
    }

    public function removeRole(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|exists:roles,name',
        ]);

        $user = \App\Models\User::findOrFail($request->user_id);
        $user->removeRole($request->role);

        return response()->json([
            'message' => 'Role removed successfully',
            'user' => $user->load('roles')
        ]);
    }
} 