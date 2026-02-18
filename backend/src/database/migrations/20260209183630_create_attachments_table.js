/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('attachments', table =>{
        table.bigIncrements('id').primary();
        table.string('entity_type').notNullable();
        table.bigInteger('entity_id').notNullable();

        table.string('original_name').notNullable();
        table.string('storage_key').notNullable().unique();
        table.string('mime_type').notNullable();

        // Size in bytes
        table.bigInteger('size').notNullable();
        table.bigInteger('created_by').notNullable();

        table.foreign('created_by').references('id').inTable('users')
        
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('attachments');
};
