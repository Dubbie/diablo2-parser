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
        Schema::create('item_properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained()->cascadeOnDelete();
            $table->string('property');
            $table->string('parameter')->nullable();
            $table->string('min')->nullable();
            $table->string('max')->nullable();
            $table->unsignedTinyInteger('property_number');

            // Foreign key
            $table->foreign('property')->references('name')->on('properties')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_properties');
    }
};
