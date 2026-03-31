const knex = require('../../../database/knex');

class WorkOrderItemsRepository{
    async create({
        work_order_id,
        name,
        quantity,
        status
    }){
        const item = await knex('work_order_items')
            .insert({
                work_order_id,
                name,
                quantity,
                status  
            }).returning('*');

        return item[0]
    }

    async update({
        id,
        data
    }){
        const item = await knex('work_order_items')
            .where({ id})
            .update({
                ...data,
                update_at : knex.fn.now()
            }).returning('*');

        return item[0]
    }

    async updateStatus({
        id,
        status
    }){
        const item = await knex('work_order_items').where({ id })
            .update({
                status,
                update_at : knex.fn.now()
            }).returning('*');

        return item[0];
    }

    async find({
        id,
        work_order_id
    }){
        const query = knex('work_order_items');

        if(id !== undefined){
            query.where({ id});
        }

        if(work_order_id !== undefined){
            query.where({ work_order_id });
        }

        return query.orderBy('id', 'asc');
    }

    async delete(id){
        await knex('work_order_items').where({ id }).del();

        return true;
    }
}

module.exports = new WorkOrderItemsRepository();