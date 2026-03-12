/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('items', table =>{
        table.bigIncrements('id').primary();
        table.bigInteger('user_id')
            .unsigned()
            .references('id')
            .inTable('users');
        table.string('name').notNullable();
        table.string('item_type', 20).notNullable();
        table.string('category', 50).notNullable();
        table.string('description').notNullable();
        table.decimal('base_price', 10, 2).notNullable();
        table.integer('quantity_available').nullable();
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('items');
};
