<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->enum('status', ['open', 'closed', 'filled'])
                  ->default('open')
                  ->after('employment_type');
        });
    }

    public function down()
    {
        Schema::table('jobs', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};