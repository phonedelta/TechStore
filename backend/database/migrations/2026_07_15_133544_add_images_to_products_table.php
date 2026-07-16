<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->json('images')->nullable()->after('image');
        });

        // Backfill gallery from existing primary image
        $products = DB::table('products')->whereNotNull('image')->get(['id', 'image']);
        foreach ($products as $product) {
            DB::table('products')->where('id', $product->id)->update([
                'images' => json_encode([$product->image]),
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('images');
        });
    }
};
