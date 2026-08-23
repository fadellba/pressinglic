<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('code_ticket')->unique();
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->string('statut')->default('recu');
            $table->decimal('montant_total', 10, 2)->default(0);
            $table->boolean('est_paye')->default(false);
            $table->timestamp('date_paiement')->nullable();
            $table->string('mode_paiement')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
