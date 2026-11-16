<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('hash');
            $table->string('uniqname')->unique();
            $table->string('icon');
            $table->string('name');
            $table->foreignId('category_id')->constrained('item_categories');
            $table->text('description')->nullable();
            $table->integer('stacksize')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
