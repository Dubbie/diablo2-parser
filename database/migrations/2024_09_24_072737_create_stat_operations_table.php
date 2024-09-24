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
        Schema::create('stat_operations', function (Blueprint $table) {
            $table->id();
            $table->string('stat');
            $table->unsignedSmallInteger('operation')->nullable();
            $table->unsignedSmallInteger('parameter')->nullable();
            $table->unsignedSmallInteger('value')->nullable();
            $table->string('base')->nullable()->comment('Base value to get from, this is a stat.');
            $table->string('affected_stat')->nullable();

            // Foreign keys
            $table->foreign('stat')->references('stat')->on('stats')->cascadeOnDelete();
            $table->foreign('base')->references('stat')->on('stats')->cascadeOnDelete();
            $table->foreign('affected_stat')->references('stat')->on('stats')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stat_operations');
    }
};
