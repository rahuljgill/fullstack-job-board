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
}
