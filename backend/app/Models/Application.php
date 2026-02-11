<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'job_id',
        'status',
        'cover_letter',
        'resume_url',
    ];

    // In app/Models/Application.php
public function getResumeUrlAttribute($value)
{
    if (!$value) {
        return null;
    }
    
    return url('storage/' . $value);
}

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function job()
    {
        return $this->belongsTo(Job::class);
    }
}