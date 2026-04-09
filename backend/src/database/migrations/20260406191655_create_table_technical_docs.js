/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('technical_docs', (table)=>{
        table.bigIncrements('id').primary();
        table.bigInteger('client_id')
            .unsigned()
            .references('id')
            .inTable('clients')
            .onDelete('RESTRICT');
        table.bigInteger('work_order_id')
            .unsigned()
            .nullable()
            .references('id')
            .inTable('work_orders')
            .onDelete('SET NULL');
        table.bigInteger('user_id')
            .unsigned()
            .references('id')
            .inTable('users')
            .onDelete('SET NULL');

        table.string('title').notNullable();
        table.string('type').notNullable();
        table.text('description').notNullable();
        table.string('status').notNullable();
        
        // Informações do responsável pela manutenção ou averiguação técnica
        table.string('responsible_name').notNullable(); 
        table.string('responsible_role').notNullable();
        table.string('responsible_document', 20).nullable(); // CPF, CNPJ ou outro documento de identificação

        // Assinatura
        table.timestamp('signed_at').nullable();
        table.boolean('is_signed').defaultTo(false);
        table.string('signature_url').nullable();

        // created_at e updated_at
        table.timestamp('deleted_at').nullable();
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('technical_docs');
};
