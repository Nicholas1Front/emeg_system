const knex = require('../../database/knex');

class DevService{
    async resetDatabase(){
        await knex.raw(`TRUNCATE TABLE users, clients, clients_contacts, notes, attachments, equipaments, items, budgets, work_orders, budget_items, work_order_items, technical_docs RESTART IDENTITY CASCADE`);

        return { message : 'Database has been reset successfully.' };
    }
}

module.exports = new DevService();