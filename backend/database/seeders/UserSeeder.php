<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        
        User::firstOrCreate(
            ['email' => 'admin@pressing.com'],
            [
                'name' => 'Gestionnaire Pressing',
                'password' => Hash::make('Password123!'),
                'phone' => '+221 77 000 00 00',
                'role' => UserRole::GESTIONNAIRE->value,
            ]
        );

        
        User::firstOrCreate(
            ['email' => 'client@pressing.com'],
            [
                'name' => 'Jean Client',
                'password' => Hash::make('Password123!'),
                'phone' => '+221 78 111 22 33',
                'role' => UserRole::CLIENT->value,
            ]
        );
    }
}
