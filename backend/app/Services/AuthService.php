<?php

namespace App\Services;

use App\DTOs\Auth\LoginDTO;
use App\DTOs\Auth\RegisterDTO;
use App\Exceptions\InvalidCredentialsException;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;

final readonly class AuthService
{
    private const string TOKEN_NAME = 'pressing_auth_token';

    private function createAccessToken(User $user): string
    {
        $expiresAt = now()->addMinutes((int) config('sanctum.expiration', 60 * 24));

        return $user->createToken(self::TOKEN_NAME, ['*'], $expiresAt)->plainTextToken;
    }

    public function __construct(
        private UserRepositoryInterface $userRepository
    ) {}

    
    public function register(RegisterDTO $dto): array
    {
        
        $user = $this->userRepository->create([
            'name' => $dto->name,
            'email' => $dto->email,
            'password' => $dto->password,
            'phone' => $dto->phone,
            'role' => $dto->role->value,
        ]);

        $token = $this->createAccessToken($user);

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    
    public function login(LoginDTO $dto): array
    {
        $user = $this->userRepository->findByEmail($dto->email);

        if ($user === null || ! Hash::check($dto->password, $user->password)) {
            throw new InvalidCredentialsException;
        }

        $user->tokens()->delete();
        $token = $this->createAccessToken($user);

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }
}
