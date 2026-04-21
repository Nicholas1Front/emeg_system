/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('technical_docs', table =>{
        table.string('responsible_name').nullable().alter();
        table.string('responsible_role').nullable().alter();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('technical_docs', table =>{
        table.string('responsible_name').notNullable();
        table.string('responsible_role').notNullable();
    })
};
