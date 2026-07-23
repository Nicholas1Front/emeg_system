/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex.raw(`
    TRUNCATE TABLE
      users,
      clients,
      equipaments,
      work_orders,
      work_order_items,
      budgets,
      budget_items,
      items,
      clients_contacts,
      financial_transactions,
      financial_categories,
      notes,
      technical_docs,
      attachments
    RESTART IDENTITY CASCADE;
  `);
};