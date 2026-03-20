/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .alterTable('budgets', table =>{
            table.decimal('final_price', 10, 2).defaultTo(0).notNullable()
            table.renameColumn('total_price', 'base_price')    
        })
        .alterTable('budget_items', table =>{
            table.decimal('final_price', 10, 2).defaultTo(0).notNullable();
            table.renameColumn('total_price', 'base_price')
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .alterTable('budgets', table =>{
            table.dropColumn('final_price');
            table.renameColumn('base_price', 'total_price')
        })
        .alterTable('budget_items', table=>{
            table.dropColumn('final_price');
            table.renameColumn('base_price', 'total_price')
        })
};
