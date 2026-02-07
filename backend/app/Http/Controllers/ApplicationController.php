<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

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
}