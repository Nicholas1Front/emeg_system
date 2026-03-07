/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .alterTable('clients', table =>{
            table.timestamp('deleted_at').nullable().index();
        })
        .alterTable('users', table =>{
            table.timestamp('deleted_at').nullable().index();
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .alterTable('clients', table =>{
            table.dropColumn('deleted_at');
        })
        .alterTable('users', table =>{
            table.dropColumn('deleted_at');
        })
};
