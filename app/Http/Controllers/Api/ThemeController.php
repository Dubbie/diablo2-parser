<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ThemeController extends Controller
{
    public function update(Request $request)
    {
        $data = $request->validate([
            'theme' => ['required', 'string', 'in:lod,minimalistic'],
        ]);

        // Save it to cookies
        try {
            // Return success
            return response()->json(['success' => true])->withCookie(cookie('theme', $data['theme'], 60 * 24 * 365));
        } catch (Exception $e) {
            Log::error($e->getMessage());
            Log::error($e->getTraceAsString());
            return response()->json(['success' => false]);
        }
    }

    public function fetch(Request $request)
    {
        return response()->json(['theme' => $request->cookie('theme')]);
    }
}
