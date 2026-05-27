/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('financial_categories', table =>{
            table.bigIncrements('id').primary();
            table.bigInteger('user_id')
                .unsigned()
                .references('id')
                .inTable('users')
                .onDelete('RESTRICT');
            table.string('title').notNullable();
            table.string('description').nullable();
            table.enu(
                'type',
                ['income', 'expense'],
            ).notNullable();
            table.timestamps(true, true);
        })
        .createTable('financial_transactions', table =>{
            table.bigIncrements('id').primary();
            table.bigInteger('user_id')
                .unsigned()
                .references('id')
                .inTable('users')
                .onDelete('RESTRICT');
            table.bigInteger('category_id')
                .unsigned()
                .references('id')
                .inTable('financial_categories')
                .onDelete('SET NULL');
            table.string('description').notNullable();
            table.decimal('amount', 10, 2).notNullable();
            table.enu(
                'type',
                ['income', 'expense'],
            ).notNullable();
            table.date('date_reference').notNullable();
            table.timestamps(true, true);
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('financial_categories')
        .dropTableIfExists('financial_transactions');
};
