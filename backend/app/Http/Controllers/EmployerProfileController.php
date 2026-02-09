<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Company;

class EmployerProfileController extends Controller
{
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'company_admin') {
            return response()->json(['message' => 'Only company admins can update company profile'], 403);
        }

        if (!$user->company_id) {
            return response()->json(['message' => 'No company associated with this account'], 404);
        }

        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'company_description' => 'nullable|string',
            'company_website' => 'nullable|url',
        ]);


        $company = Company::findOrFail($user->company_id);

        $company->update([
            'name' => $validated['company_name'],
            'description' => $validated['company_description'],
            'website' => $validated['company_website'],
        ]);

        $user->load('company');

        return response()->json([
            'message' => 'Company profile updated successfully',
            'user' => $user,
        ]);
    }
}