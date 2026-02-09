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

    public function store(Request $request)
{
    $user = $request->user();

    
    if ($user->role !== 'company_admin') {
        return response()->json(['message' => 'Only company admins can post jobs'], 403);
    }

    
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'location' => 'required|string|max:255',
        'salary_min' => 'nullable|integer|min:0',
        'salary_max' => 'nullable|integer|min:0',
        'employment_type' => 'nullable|string|in:Full-time,Part-time,Contract,Internship',
    ]);

    
    $job = Job::create([
        'company_id' => $user->company_id,
        'title' => $validated['title'],
        'description' => $validated['description'],
        'location' => $validated['location'],
        'salary_min' => $validated['salary_min'],
        'salary_max' => $validated['salary_max'],
        'employment_type' => $validated['employment_type'],
    ]);

    return response()->json([
        'message' => 'Job posted successfully',
        'job' => $job
    ], 201);
}

public function myJobs(Request $request)
{
    $user = $request->user();

    if ($user->role !== 'company_admin') {
        return response()->json(['message' => 'Only company admins can view their jobs'], 403);
    }

    $jobs = Job::where('company_id', $user->company_id)
        ->withCount('applications') // Count how many applicants per job
        ->latest()
        ->get();

    return response()->json([
        'jobs' => $jobs
    ]);
}
}
