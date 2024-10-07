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
        Schema::create('skills', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('name');
            $table->string('character_class')->nullable();
            $table->string('original_name');
            $table->string('description_string')->nullable();
            $table->unsignedTinyInteger('required_level');
            $table->unsignedTinyInteger('max_level')->nullable();
            $table->unsignedSmallInteger('required_mana')->nullable();

            $table->unsignedSmallInteger('min_mana')->nullable();
            $table->unsignedSmallInteger('mana_shift')->nullable();
            $table->unsignedSmallInteger('mana')->nullable();
            $table->integer('mana_per_level')->nullable();
            $table->string('calc_1')->nullable();
            $table->string('calc_2')->nullable();
            $table->string('calc_3')->nullable();
            $table->string('calc_4')->nullable();

            $table->string('client_calc_1')->nullable();
            $table->string('client_calc_2')->nullable();
            $table->string('client_calc_3')->nullable();

            $table->string('aura_filter')->nullable();
            $table->string('aura_state')->nullable();
            $table->string('aura_target_state')->nullable();
            $table->string('aura_len_calc')->nullable();
            $table->string('aura_range_calc')->nullable();
            $table->string('aura_stat_1')->nullable();
            $table->string('aura_stat_2')->nullable();
            $table->string('aura_stat_3')->nullable();
            $table->string('aura_stat_4')->nullable();
            $table->string('aura_stat_5')->nullable();
            $table->string('aura_stat_6')->nullable();
            $table->string('aura_calc_1')->nullable();
            $table->string('aura_calc_2')->nullable();
            $table->string('aura_calc_3')->nullable();
            $table->string('aura_calc_4')->nullable();
            $table->string('aura_calc_5')->nullable();
            $table->string('aura_calc_6')->nullable();

            $table->unsignedInteger('server_start_function')->nullable();
            $table->unsignedInteger('server_do_function')->nullable();

            $table->string('passive_state')->nullable();
            $table->string('passive_item_type')->nullable();
            $table->string('passive_stat_1')->nullable();
            $table->string('passive_calc_1')->nullable();
            $table->string('passive_stat_2')->nullable();
            $table->string('passive_calc_2')->nullable();
            $table->string('passive_stat_3')->nullable();
            $table->string('passive_calc_3')->nullable();
            $table->string('passive_stat_4')->nullable();
            $table->string('passive_calc_4')->nullable();
            $table->string('passive_stat_5')->nullable();
            $table->string('passive_calc_5')->nullable();

            $table->string('param_1')->nullable();
            $table->string('param_2')->nullable();
            $table->string('param_3')->nullable();
            $table->string('param_4')->nullable();
            $table->string('param_5')->nullable();
            $table->string('param_6')->nullable();
            $table->string('param_7')->nullable();
            $table->string('param_8')->nullable();
            $table->unsignedInteger('to_hit')->nullable();
            $table->integer('to_hit_per_level')->nullable();
            $table->string('to_hit_calc')->nullable();
            $table->unsignedSmallInteger('hit_shift')->nullable();
            $table->unsignedInteger('src_dmg')->nullable();
            $table->unsignedMediumInteger('min_dam')->nullable();
            $table->unsignedMediumInteger('min_dam_level_1')->nullable();
            $table->unsignedMediumInteger('min_dam_level_2')->nullable();
            $table->unsignedMediumInteger('min_dam_level_3')->nullable();
            $table->unsignedMediumInteger('min_dam_level_4')->nullable();
            $table->unsignedMediumInteger('min_dam_level_5')->nullable();
            $table->unsignedMediumInteger('max_dam')->nullable();
            $table->unsignedMediumInteger('max_dam_level_1')->nullable();
            $table->unsignedMediumInteger('max_dam_level_2')->nullable();
            $table->unsignedMediumInteger('max_dam_level_3')->nullable();
            $table->unsignedMediumInteger('max_dam_level_4')->nullable();
            $table->unsignedMediumInteger('max_dam_level_5')->nullable();
            $table->text('dmg_sym_per_calc')->nullable();
            $table->string('e_type')->nullable();
            $table->unsignedMediumInteger('e_min')->nullable();
            $table->unsignedMediumInteger('e_min_level_1')->nullable();
            $table->unsignedMediumInteger('e_min_level_2')->nullable();
            $table->unsignedMediumInteger('e_min_level_3')->nullable();
            $table->unsignedMediumInteger('e_min_level_4')->nullable();
            $table->unsignedMediumInteger('e_min_level_5')->nullable();
            $table->unsignedMediumInteger('e_max')->nullable();
            $table->unsignedMediumInteger('e_max_level_1')->nullable();
            $table->unsignedMediumInteger('e_max_level_2')->nullable();
            $table->unsignedMediumInteger('e_max_level_3')->nullable();
            $table->unsignedMediumInteger('e_max_level_4')->nullable();
            $table->unsignedMediumInteger('e_max_level_5')->nullable();
            $table->text('e_dmg_sym_per_calc')->nullable();
            $table->integer('e_len')->nullable();
            $table->integer('e_len_level_1')->nullable();
            $table->integer('e_len_level_2')->nullable();
            $table->integer('e_len_level_3')->nullable();
            $table->text('e_len_sym_per_calc')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skills');
    }
};
