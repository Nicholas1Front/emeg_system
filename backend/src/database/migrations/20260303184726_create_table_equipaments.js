/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('equipaments', table=>{
        table.bigIncrements('id').primary();
        table.bigInteger('client_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('clients');
        table.string('brand').notNullable();
        table.string('name').notNullable();
        table.string('identification').notNullable();
        table.timestamp('deleted_at').nullable().index();
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('equipaments');
};
