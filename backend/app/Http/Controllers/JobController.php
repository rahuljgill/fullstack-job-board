<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
   
    public function index()
    {
        $jobs = Job::with('company')
            ->latest()
            ->take(6)
            ->get();

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
