<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'role' => 'required|in:job_seeker,company_admin',
            
            // Only for employers
            'company_name' => 'required_if:role,company_admin|string|max:255',
            'company_website' => 'nullable|url',
            'company_description' => 'nullable|string',
        ]);

        $companyId = null;

        // If employer, create company first
        if ($validated['role'] === 'company_admin') {
            $company = Company::create([
                'name' => $validated['company_name'],
                'website' => $validated['company_website'] ?? null,
                'description' => $validated['company_description'] ?? null,
            ]);
            $companyId = $company->id;
        }

        // Create user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'company_id' => $companyId,
        ]);

        return response()->json([
            'message' => 'Registration successful',
            'user' => $user
        ], 201);
    }


    public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (!Auth::attempt($credentials)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $request->session()->regenerate();

    return response()->json([
        'message' => 'Login successful',
        'user' => Auth::user()
    ]);
}

public function logout(Request $request)
{
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return response()->json(['message' => 'Logged out successfully']);
}

public function me(Request $request)
{
    return response()->json([
        'user' => $request->user()
    ]);
}
}