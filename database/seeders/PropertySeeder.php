<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\TblEntry;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;

class PropertySeeder extends FromFileSeeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $propertyIds = Property::pluck('id')->toArray();

        foreach ($propertyIds as $propId) {
            $prop = Property::find($propId);
            $prop->delete();
        }

        $data = $this->readFile('app/Properties.txt');

        $this->createData($data);
    }

    private function createData(array $data): void
    {
        foreach ($data as $property) {
            DB::beginTransaction();

            try {
                $prop = Property::create([
                    'name' => $property['code'],
                ]);

                for ($i = 1; $i <= 7; $i++) {
                    $propStatData = [
                        'stat_set' => $this->getActualValue($property["set{$i}"]),
                        'value' => $this->getActualValue($property["val{$i}"]),
                        'function' => $this->getActualValue($property["func{$i}"]),
                        'stat' => $this->getActualValue($property["stat{$i}"]),
                        'stat_number' => $i,
                    ];

                    if ($propStatData['stat'] !== null) {
                        $prop->propertyStats()->create($propStatData);
                    }
                }


                DB::commit();

                $this->command->info("Property {$prop->name} created");
            } catch (QueryException $e) {
                DB::rollBack();

                $this->command->error("Property {$property['code']} failed to create: " . $e->getMessage());
            }
        }
    }
}
