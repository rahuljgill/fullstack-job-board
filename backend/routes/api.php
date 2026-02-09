<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JobController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\EmployerProfileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{id}', [JobController::class, 'show']); 


Route::middleware('guest')->group(function () {
    Route::post('/register', [UserController::class, 'register']);
    Route::post('/login', [UserController::class, 'login']);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [UserController::class, 'logout']);
    Route::get('/me', [UserController::class, 'me']);
    Route::post('/profile', [UserController::class, 'updateProfile']);
    Route::delete('/profile/resume', [UserController::class, 'deleteResume']);
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::post('/applications', [ApplicationController::class, 'store']);
    Route::get('/applications/check/{jobId}', [ApplicationController::class, 'checkIfApplied']);
    Route::post('/employer/profile', [EmployerProfileController::class, 'updateProfile']);
    Route::post('/jobs', [JobController::class, 'store']);
    Route::get('/my-jobs', [JobController::class, 'myJobs']);
    Route::get('/jobs/{jobId}/applications', [ApplicationController::class, 'getJobApplications']);



});
