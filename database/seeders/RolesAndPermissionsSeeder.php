<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'view_dashboard',

            'view_products',
            'create_products',
            'edit_products',
            'delete_products',

            'view_categories',
            'create_categories',
            'edit_categories',
            'delete_categories',

            'view_users',
            'create_users',
            'edit_users',
            'delete_users',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'web']);
        }

        
        $superAdmin = Role::create(['name' => 'super_admin', 'guard_name' => 'web']);
        $superAdmin->givePermissionTo(Permission::all());

        $productManager = Role::create(['name' => 'product_manager', 'guard_name' => 'web']);
        $productManager->givePermissionTo([
            'view_dashboard',
            'view_products',
            'create_products',
            'edit_products',
            'delete_products',
            'view_categories',
            'create_categories',
            'edit_categories',
            'delete_categories',
        ]);

        $userManager = Role::create(['name' => 'user_manager', 'guard_name' => 'web']);
        $userManager->givePermissionTo([
            'view_dashboard',
            'view_users',
            'create_users',
            'edit_users',
            'delete_users',
        ]);

        $user = \App\Models\User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('admin'),
            'email_verified_at' => now(),
        ]);
        
        $user->assignRole('super_admin');

        $user2 = \App\Models\User::create([
            'name' => 'user_manager',
            'email' => 'user_manager@gmail.com',
            'password' => bcrypt('user_manager'),
            'email_verified_at' => now(),
        ]);
        
        $user2->assignRole('user_manager');

        $user3 = \App\Models\User::create([
            'name' => 'product_manager',
            'email' => 'product_manager@gmail.com',
            'password' => bcrypt('product_manager'),
            'email_verified_at' => now(),
        ]);

        $user3->assignRole('product_manager');
    }
} 