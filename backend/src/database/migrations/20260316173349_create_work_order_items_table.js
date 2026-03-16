/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('work_order_items', table =>{
        table.bigIncrements('id').primary();
        table.bigInteger('work_order_id')
            .unsigned()
            .references('id')
            .inTable('work_orders')
            .onDelete('CASCADE');
        table.string('name').notNullable();
        table.integer('quantity').notNullable();
        table.string('status',20).notNullable();
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('work_order_items');
};
