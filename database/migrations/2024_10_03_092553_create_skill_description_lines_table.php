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
        Schema::create('skill_description_lines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('skill_description_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('type')->coment('1 = desc, 2 = dsc2, 3 = dsc3');
            $table->unsignedMediumInteger('function')->nullable()->comment('Skilldesc format description function');
            $table->string('text_a')->nullable();
            $table->string('text_b')->nullable();
            $table->string('text_a_code')->nullable();
            $table->string('text_b_code')->nullable();
            $table->string('calc_a')->nullable();
            $table->string('calc_b')->nullable();
            $table->unsignedMediumInteger('priority');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skill_description_lines');
    }
};
