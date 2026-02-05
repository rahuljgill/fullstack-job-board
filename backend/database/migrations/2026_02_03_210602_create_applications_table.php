<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            $table->foreignId('job_id')
                ->constrained()
                ->onDelete('cascade');

            $table->enum('status', [
                'applied',
                'reviewing',
                'shortlisted',
                'rejected',
                'accepted',
            ])->default('applied');

            $table->text('cover_letter')->nullable();
            $table->string('resume_url')->nullable();

            $table->timestamps();

            // Prevent duplicate applications by the same user for the same job
            $table->unique(['user_id', 'job_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
