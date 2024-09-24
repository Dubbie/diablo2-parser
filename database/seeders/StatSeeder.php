<?php

namespace Database\Seeders;

use App\Models\Stat;
use App\Models\TblEntry;
use Exception;
use Illuminate\Support\Facades\DB;

class StatSeeder extends FromFileSeeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statIds = Stat::pluck('stat')->toArray();

        foreach ($statIds as $statId) {
            $stat = Stat::find($statId);
            $stat->delete();
        }

        $data = $this->readFile('app/ItemStatCost.txt');

        $this->createData($data);
    }

    private function createData(array $data): void
    {
        $operations = [];
        $maxStatData = [];

        // Main loop, create all stats first
        foreach ($data as $row) {
            $statData = [
                'stat' => $this->getActualValue($row['Stat']),
                'id' => $this->getActualValue($row['ID']),
                'direct' => $this->getActualValue($row['direct'], true),
                'max_stat' => $this->getActualValue($row['maxstat']),
                'item_specific' => $this->getActualValue($row['itemspecific'], true),
                'damage_related' => $this->getActualValue($row['damagerelated'], true),
            ];

            // Update max stats after we are done with main loop
            $maxStatData[] = [
                'stat' => $statData['stat'],
                'max_stat' => $statData['max_stat'],
            ];
            unset($statData['max_stat']);

            // Create stat
            $stat = Stat::create($statData);

            // Create operations
            for ($i = 1; $i <= 3; $i++) {
                $opData = [
                    'stat' => $stat->stat,
                    'operation' => $this->getActualValue($row['op']),
                    'parameter' => $this->getActualValue($row['op param']),
                    'base' => $this->getActualValue($row["op base"]),
                    'affected_stat' => $this->getActualValue($row["op stat{$i}"]),
                ];

                // Do these after we have created all the stats
                if ($opData['operation'] && $opData['affected_stat']) {
                    $operations[] = $opData;
                }
            }

            // Create description
            $descriptionData = [
                'stat' => $stat->stat,
                'priority' => $this->getActualValue($row['descpriority']),
                'function' => $this->getActualValue($row['descfunc']),
                'value' => $this->getActualValue($row['descval']),
                'positive_code' => $this->getActualValue($row['descstrpos']),
                'negative_code' => $this->getActualValue($row['descstrneg']),
                'extra_code' => $this->getActualValue($row['descstr2']),
                'positive' => $this->getTranslatedValue($row['descstrpos']),
                'negative' => $this->getTranslatedValue($row['descstrneg']),
                'extra' => $this->getTranslatedValue($row['descstr2']),
                'group' => $this->getActualValue($row['dgrp']),
                'group_function' => $this->getActualValue($row['dgrpfunc']),
                'group_value' => $this->getActualValue($row['dgrpval']),
                'group_positive_code' => $this->getActualValue($row['dgrpstrpos']),
                'group_negative_code' => $this->getActualValue($row['dgrpstrneg']),
                'group_extra_code' => $this->getActualValue($row['dgrpstr2']),
                'group_positive' => $this->getTranslatedValue($row['dgrpstrpos']),
                'group_negative' => $this->getTranslatedValue($row['dgrpstrneg']),
                'group_extra' => $this->getTranslatedValue($row['dgrpstr2']),
            ];

            // Add descriptions
            $stat->description()->create($descriptionData);

            $this->command->info("Created stat: {$stat->stat}");
        }

        // Create operations
        DB::table('stat_operations')->insert($operations);

        // Create max stats
        foreach ($maxStatData as $data) {
            Stat::where('stat', $data['stat'])->update(['max_stat' => $data['max_stat']]);
        }
    }
}
