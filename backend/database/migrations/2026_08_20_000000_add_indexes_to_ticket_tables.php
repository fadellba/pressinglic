<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->index('client_id');
        });

        Schema::table('ticket_items', function (Blueprint $table) {
            $table->index('ticket_id');
            $table->index('service_id');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->index('ticket_id');
            $table->index('enregistre_par_id');
        });
    }

    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropIndex(['client_id']);
        });

        Schema::table('ticket_items', function (Blueprint $table) {
            $table->dropIndex(['ticket_id']);
            $table->dropIndex(['service_id']);
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex(['ticket_id']);
            $table->dropIndex(['enregistre_par_id']);
        });
    }
};