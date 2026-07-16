<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Older deploys may have email_verification_token instead of verification_token
        if (Schema::hasColumn('orders', 'email_verification_token') && ! Schema::hasColumn('orders', 'verification_token')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->renameColumn('email_verification_token', 'verification_token');
            });
        }

        if (! Schema::hasColumn('orders', 'verification_token')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->string('verification_token', 64)->nullable()->unique()->after('status');
            });
        }

        if (! Schema::hasColumn('orders', 'email_verified_at')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->timestamp('email_verified_at')->nullable();
            });
        }

        if (! Schema::hasColumn('orders', 'invoice_sent_at')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->timestamp('invoice_sent_at')->nullable();
            });
        }
    }

    public function down(): void
    {
        //
    }
};
