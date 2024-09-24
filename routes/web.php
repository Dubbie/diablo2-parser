<?php

use App\Http\Controllers\ItemController;
use App\Http\Controllers\PlannerController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ItemController::class, 'index'])->name('items.index');
Route::get('/item/{item}', [ItemController::class, 'show'])->name('items.show');
Route::get('/planner', [PlannerController::class, 'create'])->name('planner');
