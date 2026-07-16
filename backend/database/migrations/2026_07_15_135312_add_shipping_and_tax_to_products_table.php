<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('free_shipping')->default(false)->after('is_active');
            $table->decimal('shipping_cost', 10, 2)->default(0)->after('free_shipping');
            $table->decimal('tax_percent', 5, 2)->default(0)->after('shipping_cost');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('tax', 10, 2)->default(0)->after('shipping_cost');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['free_shipping', 'shipping_cost', 'tax_percent']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('tax');
        });
    }
};
