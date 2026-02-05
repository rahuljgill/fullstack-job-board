<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
   
    public function index(Request $request)
{
    $query = Job::with('company');

    // Filter by location
    if ($request->has('location')) {
        $query->where('location', 'like', '%' . $request->location . '%');
    }

    // Filter by employment_type
    if ($request->has('employment_type')) {
        $query->where('employment_type', $request->employment_type);
    }

    // Filter by minimum salary
    if ($request->has('salary_min')) {
        $query->where('salary_max', '>=', $request->salary_min);
    }

    // Filter by company
    if ($request->has('company_id')) {
        $query->where('company_id', $request->company_id);
    }

    // Filter by posted date (days ago)
    if ($request->has('days')) {
        $query->where('created_at', '>=', now()->subDays($request->days));
    }

    
    if (!$request->hasAny(['location', 'employment_type', 'salary_min', 'company_id', 'days'])) {
        $query->take(6);
    }

    $jobs = $query->latest()->get();

    return response()->json($jobs);
}

     public function show($id)
    {
        $job = Job::with('company')->find($id);

        if (!$job) {
            return response()->json(['error' => 'Job not found'], 404);
        }

        return response()->json($job);
    }
}
