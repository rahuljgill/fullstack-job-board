<?php

namespace Database\Factories;

use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

class JobFactory extends Factory
{
    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'title' => fake()->jobTitle(),
            'description' => fake()->paragraph(4),
            'location' => fake()->city(),
            'salary_min' => fake()->numberBetween(40000, 70000),
            'salary_max' => fake()->numberBetween(80000, 120000),
            'employment_type' => fake()->randomElement([
                'full-time',
                'part-time',
                'contract',
            ]),
            'status' => 'active',
        ];
    }
}
