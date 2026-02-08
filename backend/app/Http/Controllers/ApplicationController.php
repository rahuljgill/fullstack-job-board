<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Application;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use App\Mail\ApplicationSubmitted; 


class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $applications = $request->user()
            ->applications()
            ->with(['job.company'])
            ->latest()
            ->get();

        return response()->json([
            'applications' => $applications
        ]);
    }





public function store(Request $request)
{
    $user = $request->user();

    if ($user->role !== 'job_seeker') {
        return response()->json(['message' => 'Only job seekers can apply'], 403);
    }

    $validated = $request->validate([
        'job_id' => 'required|exists:jobs,id',
        'cover_letter' => 'nullable|string',
        'resume' => 'nullable|file|mimes:pdf|max:5120',
    ]);

    $existing = Application::where('user_id', $user->id)
        ->where('job_id', $validated['job_id'])
        ->first();

    if ($existing) {
        return response()->json(['message' => 'You have already applied to this job'], 422);
    }

    $resumeUrl = null;

    if ($request->hasFile('resume')) {
        $path = $request->file('resume')->store('applications', 'public');
        $resumeUrl = $path;
    } else {
        $resumeUrl = $user->default_resume_url;
    }

    $application = Application::create([
        'user_id' => $user->id,
        'job_id' => $validated['job_id'],
        'cover_letter' => $validated['cover_letter'],
        'resume_url' => $resumeUrl,
        'status' => 'applied',
    ]);

    
    $application->load('job.company');

    
    Mail::to($user->email)->send(new ApplicationSubmitted($application, $user));

    return response()->json([
        'message' => 'Application submitted successfully',
        'application' => $application
    ], 201);
}

public function checkIfApplied(Request $request, $jobId)
    {
        
        if (!$request->user()) {
            return response()->json(['has_applied' => false]);
        }

        $hasApplied = Application::where('user_id', $request->user()->id)
            ->where('job_id', $jobId)
            ->exists();

        return response()->json(['has_applied' => $hasApplied]);
    }
}