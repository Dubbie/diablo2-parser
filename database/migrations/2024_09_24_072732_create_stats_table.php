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
        Schema::create('stats', function (Blueprint $table) {
            $table->string('stat')->primary();
            $table->unsignedBigInteger('id')->unique();
            $table->boolean('direct')->nullable();
            $table->string('max_stat')->nullable();
            $table->boolean('item_specific')->default(false);
            $table->boolean('damage_related')->default(false);

            // Foreign keys
            $table->foreign('max_stat')->references('stat')->on('stats')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stats');
    }
};
