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
        Schema::create('stat_descriptions', function (Blueprint $table) {
            $table->string('stat')->primary();
            $table->unsignedMediumInteger('priority')->nullable();
            $table->unsignedSmallInteger('function')->nullable();
            $table->unsignedTinyInteger('value')->nullable();
            $table->string('positive_code')->nullable();
            $table->string('negative_code')->nullable();
            $table->string('extra_code')->nullable()->comment('descstr2');
            $table->string('positive')->nullable();
            $table->string('negative')->nullable();
            $table->string('extra')->nullable();
            $table->unsignedMediumInteger('group')->nullable();
            $table->unsignedSmallInteger('group_function')->nullable();
            $table->unsignedTinyInteger('group_value')->nullable();
            $table->string('group_positive_code')->nullable();
            $table->string('group_negative_code')->nullable();
            $table->string('group_extra_code')->nullable()->comment('dgrpstr2');
            $table->string('group_positive')->nullable();
            $table->string('group_negative')->nullable();
            $table->string('group_extra')->nullable();

            // Foreign keys
            $table->foreign('stat')->references('stat')->on('stats')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stat_descriptions');
    }
};
