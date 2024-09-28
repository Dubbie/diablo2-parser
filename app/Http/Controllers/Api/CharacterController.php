<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CharacterStat;

class CharacterController extends Controller
{
    public function fetch()
    {
        return CharacterStat::all();
    }
}
