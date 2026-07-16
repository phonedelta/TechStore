<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return response()->json([
        'app' => config('app.name'),
        'status' => 'ok',
    ]);
});

/**
 * Serve uploaded files without relying on the public/storage symlink
 * (often missing or broken on Railway / FrankenPHP).
 */
Route::get('/storage/{path}', function (string $path) {
    $path = ltrim(str_replace('..', '', $path), '/');

    if ($path === '' || ! Storage::disk('public')->exists($path)) {
        abort(404);
    }

    return Storage::disk('public')->response($path);
})->where('path', '.*')->name('storage.public');
