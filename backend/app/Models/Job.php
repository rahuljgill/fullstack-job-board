<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'title',
        'description',
        'location',
        'salary_min',
        'salary_max',
        'employment_type',
        'status',
    ];

    protected $casts = [
        'salary_min' => 'decimal:2',
        'salary_max' => 'decimal:2',
    ];

    // Relationships
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}