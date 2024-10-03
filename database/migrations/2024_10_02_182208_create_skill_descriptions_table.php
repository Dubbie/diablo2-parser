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
        Schema::create('skill_descriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('skill_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('page');
            $table->unsignedSmallInteger('skill_row');
            $table->unsignedSmallInteger('skill_column');
            $table->string('name_code');
            $table->string('name');
            $table->string('short_code');
            $table->string('short');
            $table->string('long_code');
            $table->string('long');
            $table->string('alt_code');
            $table->string('alt');
            $table->string('mana_code')->nullable();
            $table->string('mana')->nullable();
            $table->string('icon_usable');
            $table->string('icon_unusable');
            $table->unsignedMediumInteger('damage')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skill_descriptions');
    }
};
