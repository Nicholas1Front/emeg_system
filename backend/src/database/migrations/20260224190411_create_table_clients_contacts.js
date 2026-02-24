/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('clients_contacts', table =>{
        table.bigIncrements('id').primary();
        table.bigInteger('client_id')
            .unsigned()
            .references('id')
            .inTable('clients')
            .onDelete('CASCADE');
        table.string('name').nullable();
        table.string('email').nullable();
        table.string('phone').nullable();
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('clients_contacts');
};
