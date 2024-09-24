<?php

use App\Http\Controllers\Api\ItemController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('fetch', [ItemController::class, 'fetch'])->name('api.items.fetch');
