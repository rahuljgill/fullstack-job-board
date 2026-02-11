<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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

        $token = $user->createToken('auth-token')->plainTextToken;
        return response()->json([
            'message' => 'Registration successful',
            'user' => $user,
            'token' => $token
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
            $user = Auth::user();


            $token = $user->createToken('auth-token')->plainTextToken;


    return response()->json([
        'message' => 'Login successful',
        'user' => $user,
        'token' => $token
    ]);
}

public function logout(Request $request)
{
            $request->user()->tokens()->delete();


    return response()->json(['message' => 'Logged out successfully']);
}

public function me(Request $request)
{
    $user = $request->user();
    
    // Load company relationship for company admins
    if ($user->role === 'company_admin') {
        $user->load('company');
    }
    
    return response()->json([
        'user' => $user
    ]);
}




public function updateProfile(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'bio' => 'nullable|string',
        'skills' => 'nullable|string',
        'phone' => 'nullable|string|max:20',
        'location' => 'nullable|string|max:255',
        'portfolio_url' => 'nullable|url',
        'linkedin_url' => 'nullable|url',
        'resume' => 'nullable|file|mimes:pdf|max:5120', // 5MB
    ]);

    $user = $request->user();

    
    if ($request->hasFile('resume')) {
        // Delete old resume if exists
        if ($user->default_resume_url) {
            Storage::disk('public')->delete($user->default_resume_url);
        }

       
        $path = $request->file('resume')->store('resumes', 'public');
        $validated['default_resume_url'] = $path;
    }

    $user->update($validated);

    return response()->json([
        'message' => 'Profile updated successfully',
        'user' => $user
    ]);
}

public function deleteResume(Request $request)
{
    $user = $request->user();

    if (!$user->default_resume_url) {
        return response()->json(['message' => 'No resume to delete'], 404);
    }

    
    Storage::disk('public')->delete($user->default_resume_url);

    // Clear database field
    $user->update(['default_resume_url' => null]);

    return response()->json(['message' => 'Resume deleted successfully']);
}
}