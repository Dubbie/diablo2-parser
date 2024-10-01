<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PlannerController extends Controller
{
    public function create()
    {
        return Inertia::render('Planner/Planner', [
            'debug' => config('item.debug'),
        ]);
    }
}
