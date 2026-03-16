/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('work_orders', table => {
        table.bigIncrements('id').primary();
        table.bigInteger('budget_id')
            .unsigned()
            .references('id')
            .inTable('budgets')
            .onDelete('RESTRICT')
            .nullable();
        table.bigInteger('user_id')
            .unsigned()
            .references('id')
            .inTable('users')
            .onDelete('RESTRICT')
            .notNullable();
        table.bigInteger('client_id')
            .unsigned()
            .references('id')
            .inTable('clients')
            .onDelete('RESTRICT')
            .notNullable();
        table.bigInteger('equipament_id')
            .unsigned()
            .references('id')
            .inTable('equipaments')
            .onDelete('RESTRICT')
            .notNullable();

        table.string('name').notNullable();
        table.timestamp('entry_date').notNullable();
        table.timestamp('exit_date').notNullable();
        table.string('warranty').notNullable(); // Garantia
        table.text('observations').nullable();
        table.string('status',20).notNullable();
        table.timestamp('deleted_at').nullable();
        table.string('pdf_url').nullable();
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('work_orders');
};
