const knex = require('../../database/knex');

class WorkOrdersRepository{
    async create({
        budget_id,
        client_id,
        equipament_id,
        user_id,
        name,
        entry_date,
        exit_date,
        warranty,
        observations,
        status,
        pdf_url
    }){
        const order = await knex('work_orders')
            .insert({
                budget_id,
                client_id,
                equipament_id,
                user_id,
                name,
                entry_date,
                exit_date,
                warranty,
                observations,
                status,
                pdf_url
            }).returning('*');

        return order[0];
    }

    async update({
        id,
        data
    }){
        const order = await knex('work_orders')
            .where({ id})
            .update({
                ...data,
                updated_at: knex.fn.now()
            }).returning('*');

        return order[0]
    }

    async find({
        budget_id,
        client_id,
        equipament_id,
        user_id,
        id,
        name,
        entry_date,
        exit_date,
        status,
        includedDeactivated
    }){
        const query = knex('work_orders');

        if(!includedDeactivated || includedDeactivated === undefined){
            query.whereNull('deleted_at');
        }

        if(includedDeactivated === true){
            query.whereNotNull('deleted_at');
        }

        if(budget_id !== undefined){
            query.where({ budget_id });
        }

        if(client_id !== undefined){
            query.where({ client_id});
        }

        if(equipament_id !== undefined){
            query.where({ equipament_id });
        }

        if(user_id !== undefined){
            query.where({ user_id });
        }

        if(name !== undefined){
            query.where('name', 'ilike', `%${name.trim()}%`);
        }

        if(id !== undefined){
            query.where({ id });
        }

        if(status !== undefined){
            query.where({ status });
        }

        if(entry_date !== undefined && exit_date !== undefined){
            query.whereBetween('entry_date', [entry_date, exit_date]);
        }

        if(entry_date !== undefined && exit_date === undefined){
            query.where('entry_date', '>=', entry_date);
        }

        if(entry_date === undefined && exit_date !== undefined){
            query.where('exit_date', '<=', exit_date);
        }

        return query.orderBy('id', 'asc');
    }

    async deactivate(id){
        const order = await knex('work_orders').where({ id }).update({
            delete_at: knex.fn.now()
        }).returning('*');

        return order[0];
    }

    async activate(id){
        const order = await knex('work_orders').where({ id }).update({
            delete_at: null
        }).returning('*');

        return order[0];
    }
}

module.exports = new WorkOrdersRepository();