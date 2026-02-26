const knex = require('../../database/knex');

class ClientsRepository{
    async createClient({
        name,
        address,
        document,
        type
    }){
        const client = await knex('clients').insert({
            name,
            address,
            document,
            type
        }).returning('*');

        return client[0];
    }

    async createContact({
        client_id,
        name,
        email,
        phone
    }){
        const contact = await knex('clients_contacts').insert({
            client_id,
            name,
            email,
            phone
        }).returning('*');

        return contact[0];
    }

    async findClients(filters){
        const query = knex('clients');

        if(filters.id !== undefined){
            query.where('id', filters.id);
        }

        if(filters.name !== undefined){
            query.where('name', filters.name);
        }

        if(filters.address !== undefined){
            query.where('address', filters.address);
        }

        if(filters.document !== undefined){
            query.where('document', filters.document);
        }

        if(filters.type !== undefined){
            if(filters.type === 'PF'){
                query.where('type', 'PF');
            }else if(filters.type === 'PJ'){
                query.where('type', 'PJ');
            }
        }

        return query.orderBy('id', 'desc');
    }

    async findContacts(filters){
        const query = knex('clients_contacts');

        if(filters.id !== undefined){
            query.where('id', filters.id);
        }

        if(filters.client_id !== undefined){
            query.where('client_id', filters.client_id);
        }

        if(filters.name !== undefined){
            query.where('name', filters.name);
        }

        if(filters.email !== undefined){
            query.where('email', filters.email);
        }

        if(filters.phone !== undefined){
            query.where('phone', filters.phone);
        }

        return query.orderBy('id', 'desc');
    }

    async updateClient({
        id,
        data
    }){
        const client = await knex('clients')
            .where({ id })
            .update(data)
            .returning('*');

        return client[0];
    }

    async updateContact({
        id,
        data
    }){
        const contact = await knex('clients_contacts')
            .where({ id })
            .update(data)
            .returning('*');

        return contact[0];
    }

    async deleteClient(id){
        await knex('clients').where({ id }).delete();

        return true;
    }

    async deleteContact(id){
        await knex('clients_contacts').where({ id }).delete();

        return true;
    }
}

module.exports = new ClientsRepository();