<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Job;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'job_id' => Job::factory(),
            'status' => fake()->randomElement([
                'applied',
                'reviewing',
                'shortlisted',
                'rejected',
            ]),
            'cover_letter' => fake()->paragraph(),
            'resume_url' => fake()->url(),
        ];
    }
}
