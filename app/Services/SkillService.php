<?php

namespace App\Services;

class SkillService
{
    public static function findByParam(mixed $param)
    {
        if (is_numeric($param)) {
            return self::findSkillById(intval($param));
        }

        return self::findSkillByName($param);
    }

    public static function findSkillById(int $id)
    {
        return \App\Models\Skill::find($id);
    }

    public static function findSkillByName(string $name)
    {
        return \App\Models\Skill::where('name', $name)->first();
    }
}
