<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use App\Models\SkillDescription;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function fetch(Request $request)
    {
        $class = $request->input('class');

        $mappedClass = SkillDescription::CLASS_MAP[$class] ?? null;
        if (!$mappedClass) {
            return response()->json('Class not found', 404);
        }

        $data = Skill::whereHas('description')
            ->with('description', 'skillPrerequisites')
            ->where('character_class', $mappedClass)
            ->orWhereIn('name', ['Attack', 'Throw'])
            ->get();
        return response()->json($data);
    }
}
