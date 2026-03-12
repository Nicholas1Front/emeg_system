const knex = require('../../database/knex');

class DevService{
    async resetDatabase(){
        await knex.raw(`TRUNCATE TABLE users, clients, clients_contacts, notes, attachments, equipaments, items RESTART IDENTITY CASCADE`);

        return { message : 'Database has been reset successfully.' };
    }
}

module.exports = new DevService();