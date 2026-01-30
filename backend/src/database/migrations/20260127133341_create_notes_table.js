/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('notes', (table)=>{
    table.bigIncrements('id').primary();
    table.string('title');
    table.text('content').notNullable();
    table.date('date_reference').notNullable();
    table.bigInteger('creator_id').unsigned().notNullable();
    table.foreign('creator_id').references('id').inTable('users');
    table.timestamps(true, true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('notes');
};
