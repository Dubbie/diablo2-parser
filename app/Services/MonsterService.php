<?php

namespace App\Services;

class MonsterService
{
    public static function getMonsterByParam(mixed $param)
    {
        if (is_numeric($param)) {
            return \App\Models\Monster::find($param);
        } else {
            return \App\Models\Monster::where('name', $param)->first();
        }
    }
}
