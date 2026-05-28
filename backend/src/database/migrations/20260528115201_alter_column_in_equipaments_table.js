/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('equipaments', table=>{
        table.renameColumn('name', 'model');
        table.string('type').notNullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable('equipaments', table=>{
        table.renameColumn('model', 'name');
        table.dropColumn('type');
    })
};
