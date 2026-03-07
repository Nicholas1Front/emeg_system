const knex = require('../../database/knex');

class EquipamentsRepository{
    async create({
        client_id,
        brand,
        name,
        identification,
        deleted_at
    }){
        const equipament = await knex('equipaments').insert({
            client_id,
            brand,
            name,
            identification,
            deleted_at
        }).returning('*');

        return equipament[0];
    }

    async find({
        id,
        client_id,
        brand,
        name,
        identification,
        includedDeleted = false
    }){
        const query = knex('equipaments');

        if(!includedDeleted){
            query.whereNull('deleted_at');
        }

        if(includedDeleted){
            query.whereNotNull('deleted_at');
        }

        if(id !== undefined){
            query.where('id', id);
        }

        if(client_id !== undefined){
            query.where('client_id', client_id);
        }

        if(brand !== undefined){
            query.where('brand', brand);
        }

        if(name !== undefined){
            query.where('name', name);
        }

        if(identification !== undefined){
            query.where('identification', identification);
        }

        return query.orderBy('id', 'desc');
    }

    async update({
        id,
        data
    }){
        const equipament = await knex('equipaments').where({id}).update({
            ...data,
            updated_at: knex.fn.now()
        }).returning('*');

        return equipament[0];
    }

    async deactivate(id){
        const equipament = await knex('equipaments').where({id}).update({
            deleted_at: knex.fn.now()
        }).returning('*');

        return equipament[0];
    }

    async activate(id){
        const equipament = await knex('equipaments').where({id}).update({
            deleted_at: null
        }).returning('*');

        return equipament[0];
    }
}

module.exports = new EquipamentsRepository();