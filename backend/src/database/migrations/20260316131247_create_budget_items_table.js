/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('budget_items', table =>{
        table.bigIncrements('id').primary();
        table.bigInteger('budget_id')
            .unsigned()
            .references('id')
            .inTable('budgets')
            .onDelete('CASCADE');
        table.string('name').notNullable();
        table.decimal('unit_price', 10, 2).notNullable();
        table.integer('quantity').notNullable();
        table.decimal('total_price', 10, 2).notNullable();
        table.decimal('discount_percent', 5, 2).defaultTo(0).notNullable(); // Desconto aplicado ao item
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('budget_items');
};
