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
        Schema::create('property_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            $table->string('stat');
            $table->string('stat_set')->nullable();
            $table->unsignedSmallInteger('function')->nullable();
            $table->string('value')->nullable();
            $table->unsignedSmallInteger('stat_number');

            // Foreign keys
            $table->foreign('stat')->references('stat')->on('stats')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_stats');
    }
};
