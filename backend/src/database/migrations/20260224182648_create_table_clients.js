/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('clients', table =>{
        table.bigIncrements('id').primary();
        table.string('name').notNullable();
        table.string('document', 20).notNullable().unique();
        table.enu('type', ['PF', 'PJ'],{
            useNative: true,
            enumName : 'client_type_enum'
        }).notNullable();
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('clients')
        .raw('DROP TYPE IF EXISTS client_type_enum');
};
