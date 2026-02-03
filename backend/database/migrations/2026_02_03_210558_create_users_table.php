<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', ['job_seeker', 'company_admin'])->default('job_seeker');
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade');
            
            // Profile fields
            $table->text('bio')->nullable();
            $table->text('skills')->nullable(); // You can use json('skills') if you prefer
            $table->string('phone')->nullable();
            $table->string('location')->nullable();
            $table->string('default_resume_url')->nullable();
            $table->string('portfolio_url')->nullable();
            $table->string('linkedin_url')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};