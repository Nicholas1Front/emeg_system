/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('budgets', table =>{
        table.bigIncrements('id').primary();
        table.bigInteger('user_id')
            .unsigned()
            .references('id')
            .inTable('users')
            .onDelete('RESTRICT');
        table.bigInteger('client_id')
            .unsigned()
            .references('id')
            .inTable('clients')
            .onDelete('RESTRICT');
        table.bigInteger('equipament_id')
            .unsigned()
            .references('id')
            .inTable('equipaments')
            .onDelete('RESTRICT');
        table.string('name').notNullable();
        table.decimal('discount_percent', 5, 2).defaultTo(0).notNullable(); // Desconto aplicado ao orçamento
        table.string('payment_condition').nullable(); // Condição de pagamento (ex : 21 dias ou á vista)
        table.string('term_service').nullable(); // Prazo de serviço
        table.string('warranty').nullable(); // Garantia
        table.decimal('total_price', 10, 2).defaultTo(0).notNullable();
        table.string('status', 20).notNullable();
        table.string('pdf_url').nullable();
        table.timestamp('deleted_at').nullable();
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('budgets');
};
