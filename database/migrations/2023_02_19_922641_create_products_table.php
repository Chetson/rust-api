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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->foreignId('product_type_id')->constrained('product_types');
            $table->foreignId('server_id')->constrained('servers');
            $table->foreignId('item_id')->nullable()->constrained('items');
            $table->foreignId('command_id')->nullable()->constrained('commands');
            $table->foreignId('set_id')->nullable()->constrained('sets');
            $table->integer('amount');
            $table->float('price');
            $table->integer('discount')->nullable();
            $table->string('discount_type')->nullable();
            $table->boolean('returnable');
            $table->foreignId('product_category_id')->constrained('product_categories');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
