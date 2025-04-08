<?php

namespace Tests\Unit;
use Illuminate\Foundation\Testing\TestCase;
use App\Models\User;

class CategoryControllerTest extends TestCase
{    
    protected function setUp(): void
    {
        parent::setUp();
        
        $user = User::factory()->create();
        $this->actingAs($user);
    }

    public function test_create_category(): void
    {
        $request = $this->post('/api/v1/admin/categories', [
            'name' => 'Sports'
        ]);
        $request->assertStatus(201);
    }

    // public function test_get_all_categories(): void
    // {
    //     $request = $this->get('/api/v1/admin/categories');
    //     $request->assertStatus(200);
    // }

    // public function test_update_category(): void
    // {
    //     $request = $this->put('/api/v1/admin/categories/1', [
    //         'name' => 'Old Category'
    //     ]);
    //     $request->assertStatus(200);
    // }

    // public function test_delete_category(): void
    // {
    //     $request = $this->delete('/api/v1/admin/categories/1');
    //     $request->assertStatus(200);
    // }
}