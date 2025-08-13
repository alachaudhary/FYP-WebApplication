<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
class AuthController extends Controller
{
    
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);
    
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
    
            // Generate token
            $token = $user->createToken('auth_token')->plainTextToken;
    
            return response()->json([
                'message' => 'User registered successfully',
                'user' => $user,
                'token' => $token, // Ensure the token is returned
            ], 201); // 201 Created status code
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ], 500); // 500 Internal Server Error
        }
    }
public function login(Request $request)
{
    \Log::info('Login request:', ['email' => $request->email]);

    $user = \App\Models\User::where('email', $request->email)->first();

    if (!$user) {
        \Log::error('User not found');
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    if (!\Hash::check($request->password, $user->password)) {
        \Log::error('Password does not match', [
            'input_password' => $request->password,
            'user_password' => $user->password,
        ]);
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Login successful',
        'user' => $user,
        'token' => $token
    ]);
}


      
    

    


public function user(Request $request)
{
    \Log::info('User route hit'); // Log when this route is accessed

    if (!$request->hasHeader('Authorization')) {
        \Log::error('Authorization header missing');
        return response()->json(['message' => 'Authorization header missing'], 401);
    }

    $user = $request->user(); // Retrieve authenticated user

    if (!$user) {
        \Log::error('User not found using token');
        return response()->json(['message' => 'User not found'], 401);
    }

    \Log::info('Authenticated User:', ['user' => $user]);
    return response()->json(['user' => $user], 200);
}




public function logout(Request $request)
{
    $request->user()->currentAccessToken()->delete();

    return response()->json(['message' => 'Logged out successfully']);
}



}