<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(TblEntrySeeder::class);
        $this->call(StatSeeder::class);
        $this->call(SkillSeeder::class);
        $this->call(MonsterSeeder::class);
        $this->call(PropertySeeder::class);
        $this->call(WeaponSeeder::class);
        $this->call(ArmorSeeder::class);
        $this->call(MiscSeeder::class);
        $this->call(UniqueSeeder::class);
    }
}
