<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CompanyFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->company,
            'website' => $this->faker->url,
            'description' => $this->faker->paragraph,
            'logo_url' => null,
        ];
    }
}
