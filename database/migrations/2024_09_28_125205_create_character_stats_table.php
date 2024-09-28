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
        Schema::create('character_stats', function (Blueprint $table) {
            $table->string('name')->primary();
            $table->json('base_attributes');
            $table->unsignedInteger('hp_extra');
            $table->unsignedInteger('life_per_level');
            $table->unsignedInteger('mana_per_level');
            $table->unsignedInteger('mana_regen');
            $table->unsignedInteger('life_per_vitality');
            $table->unsignedInteger('stat_per_level');
            $table->unsignedInteger('base_block');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('character_stats');
    }
};
