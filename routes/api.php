<?php

use App\Http\Controllers\Api\CharacterController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\SkillController;
use Illuminate\Support\Facades\Route;

Route::get('/items/fetch', [ItemController::class, 'fetch'])->name('api.items.fetch');
Route::get('/items/{item}', [ItemController::class, 'details'])->name('api.items.details');
Route::post('/items/create', [ItemController::class, 'create'])->name('api.items.create');
Route::post('/items/update', [ItemController::class, 'update'])->name('api.items.update');

Route::get('/characters/fetch', [CharacterController::class, 'fetch'])->name('api.characters.fetch');
Route::get('/skills/fetch', [SkillController::class, 'fetch'])->name('api.skills.fetch');
