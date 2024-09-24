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
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable()->comment("Name for uniques, crafted, magic, etc.");
            $table->string('base_name');
            $table->string('item_type')->comment("weapon, armor, misc.");
            $table->string('type');
            $table->string('type2')->nullable();
            $table->string('code');
            $table->string('image');
            $table->string('code_normal')->nullable();
            $table->string('code_exceptional')->nullable();
            $table->string('code_elite')->nullable();
            $table->unsignedSmallInteger('rarity')->nullable();
            $table->boolean('one_or_two_handed')->default(false);
            $table->boolean('two_handed')->default(false);
            $table->boolean('spawnable')->default(false);
            $table->json('base_stats');
            $table->unsignedSmallInteger('str_bonus')->nullable();
            $table->unsignedSmallInteger('dex_bonus')->nullable();
            $table->unsignedSmallInteger('durability')->default(0);
            $table->boolean('no_durability')->default(false);
            $table->unsignedSmallInteger('level');
            $table->unsignedSmallInteger('magic_level')->nullable();
            $table->unsignedSmallInteger('width');
            $table->unsignedSmallInteger('height');
            $table->boolean('has_inventory')->default(false);
            $table->boolean('is_template')->default(true);
            $table->unsignedSmallInteger('sockets')->nullable();
            $table->unsignedSmallInteger('gem_apply_type')->nullable()->comment("Gem effect type. 0 = weapon, 1 = armor / helm, 2 = shield");
            $table->boolean('unique')->comment("Drops as unique only.");
            $table->boolean('skip_base_name')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
