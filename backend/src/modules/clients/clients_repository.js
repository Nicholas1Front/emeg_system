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

    async findClients({
        id,
        name,
        address,
        document,
        type
    }){
        const query = knex('clients');

        if(id !== undefined){
            query.where('id', id);
        }

        if(name !== undefined){
            query.where('name', name);
        }

        if(address !== undefined){
            query.where('address', address);
        }

        if(document !== undefined){
            query.where('document', document);
        }

        if(type !== undefined){
            if(type === 'PF'){
                query.where('type', 'PF');
            }else if(type === 'PJ'){
                query.where('type', 'PJ');
            }
        }

        return query.orderBy('id', 'desc');
    }

    async findContacts({
        id,
        client_id,
        name,
        email,
        phone
    }){
        const query = knex('clients_contacts');

        if(id !== undefined){
            query.where('id', id);
        }

        if(client_id !== undefined){
            query.where('client_id', client_id);
        }

        if(name !== undefined){
            query.where('name', name);
        }

        if(email !== undefined){
            query.where('email', email);
        }

        if(phone !== undefined){
            query.where('phone', phone);
        }

        return query.orderBy('id', 'desc');
    }

    async updateClient({
        id,
        data
    }){
        const client = await knex('clients')
            .where({ id })
            .update({
                ...data,
                updated_at: knex.fn.now()
            })
            .returning('*');

        return client[0];
    }

    async updateContact({
        id,
        data
    }){
        const contact = await knex('clients_contacts')
            .where({ id })
            .update({
                ...data,
                updated_at: knex.fn.now()
            })
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