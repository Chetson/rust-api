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
            $table->text('description')->nullable();
            $table->integer('amount')->default(1);
            $table->float('price')->default(1.00);
            $table->integer('discount')->default(0.00);
            $table->string('discount_type')->default('percent');
            $table->boolean('returnable')->default(false);
            $table->unsignedInteger('sort')->default(99999);
            $table->foreignId('product_type_id')->constrained('product_types');
            $table->foreignId('product_category_id')->constrained('product_categories');
            $table->foreignId('server_id')->constrained('servers');
            $table->foreignId('item_id')->nullable()->constrained('items');
            $table->foreignId('command_id')->nullable()->constrained('commands');
            $table->foreignId('set_id')->nullable()->constrained('sets');
            $table->dateTime('blocked_until')->default(NULL)->nullable();
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
