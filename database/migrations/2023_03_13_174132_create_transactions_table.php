<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 10, 2)->default(0);
            $table->foreignId('user_id')->constrained('users');
            $table->string('description', 255)->nullable();
            $table->enum('status', [
                \App\Enums\Transaction\StatusEnum::CREATED,
                \App\Enums\Transaction\StatusEnum::FAILED,
                \App\Enums\Transaction\StatusEnum::CONFIRMED,
                \App\Enums\Transaction\StatusEnum::WAITING,
                \App\Enums\Transaction\StatusEnum::CANCELED,
            ])->default(\App\Enums\Transaction\StatusEnum::CREATED);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transactions');
    }
};
