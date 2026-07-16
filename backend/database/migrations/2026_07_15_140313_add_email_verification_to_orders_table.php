<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('email_verification_token', 64)->nullable()->unique()->after('status');
            $table->timestamp('email_verified_at')->nullable()->after('email_verification_token');
            $table->timestamp('invoice_sent_at')->nullable()->after('email_verified_at');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['email_verification_token', 'email_verified_at', 'invoice_sent_at']);
        });
    }
};
