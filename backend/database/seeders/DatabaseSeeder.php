<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Company;
use App\Models\Job;
use App\Models\Application;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 5 companies
        $companies = Company::factory(5)->create();

        // 2 company admins per company
        $companies->each(function ($company) {
            User::factory(2)->create([
                'role' => 'company_admin',
                'company_id' => $company->id,
            ]);

            // 5 jobs per company
            Job::factory(5)->create([
                'company_id' => $company->id,
            ]);
        });

        // 5 job seekers
        $jobSeekers = User::factory(5)->create([
            'role' => 'job_seeker',
            'company_id' => null,
        ]);

        $jobs = Job::all();

        // Each job seeker applies to 3 random jobs
        $jobSeekers->each(function ($user) use ($jobs) {
            $jobs->random(3)->each(function ($job) use ($user) {
                Application::factory()->create([
                    'user_id' => $user->id,
                    'job_id' => $job->id,
                ]);
            });
        });
    }
}
