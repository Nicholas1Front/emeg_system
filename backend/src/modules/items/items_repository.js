const knex = require('../../database/knex');

class ItemsRepository{
    async create({
        user_id,
        name,
        description,
        base_price,
        item_type,
        category,
        quantity_available
    }){
        const item = await knex('items').insert({
            user_id : user_id,
            name : name,
            description : description,
            base_price : base_price,
            item_type : item_type,
            category : category,
            quantity_available : quantity_available
        }).returning('*');

        return item[0];
    }

    async update({
        id,
        itemData
    }){
        const item = await knex('items').where({id}).update({
            ...itemData,
            updated_at : knex.fn.now()
        }).returning('*');

        return item[0]
    }

    async find({
        id,
        user_id,
        name,
        item_type,
        category,
        base_price,
        quantity_available
    }){
        const query = knex('items');

        if(id !== undefined){
            query.where({id});
        }

        if(user_id !== undefined){
            query.where({user_id});
        }

        if(name !== undefined){
            query.where('name', 'ilike', `%${name.trim()}%`);
        }

        if(item_type !== undefined){
            query.where({item_type});
        }

        if(category !== undefined){
            query.where({category});
        }

        if(base_price !== undefined){
            query.where('base_price', '>=', base_price);
        }

        if(quantity_available !== undefined){
            query.where('quantity_available', '>=', quantity_available);
        }

        return query.orderBy('id', 'asc');
    }

    async delete(id){
        await knex('items').where({id}).delete();

        return true;
    }
}

module.exports = new ItemsRepository();