const knex = require('../../database/knex');

class BudgetsRepository{
    async create({
        user_id,
        client_id,
        equipament_id,
        name,
        discount_percent,
        payment_condition,
        term_service,
        warranty,
        base_price,
        final_price,
        status,
        pdf_url,
        observations
    }){
        const budget = await knex('budgets').insert({
            user_id,
            client_id,
            equipament_id,
            name,
            discount_percent,
            payment_condition,
            term_service,
            warranty,
            base_price,
            final_price,
            status,
            pdf_url,
            observations
        }).returning('*');

        return budget[0];
    }

    async update({
        id,
        budgetData
    }){
        const budget = await knex('budgets')
            .where({id})
            .update({
                ...budgetData,
                updated_at: knex.fn.now()
            })
            .returning('*');

        return budget[0];
    }

    async updateStatus({
        id,
        status
    }){
        const budget = await knex('budgets').where({id}).update({
            status,
            updated_at: knex.fn.now()
        }).returning('*');

        return budget[0];
    }

    async find({
        id,
        client_id,
        equipament_id,
        name,
        status,
        final_price,
        includedDeactivated
    }){
        const query = knex('budgets');

        if(includedDeactivated === undefined || includedDeactivated === false){
            query.whereNull('deleted_at');
        }

        if(includedDeactivated === true){
            query.whereNotNull('deleted_at');
        }

        if(id !== undefined){
            query.where('id', id);
        }

        if(client_id !== undefined){
            query.where('client_id', client_id);
        }

        if(equipament_id !== undefined){
            query.where('equipament_id', equipament_id);
        }

        if(name !== undefined){
            query.where('name', name);
        }

        if(status !== undefined){
            query.where('status', status);
        }

        if(final_price !== undefined){
            query.where('final_price', final_price);
        }

        return query.orderBy('id', 'asc');
    }

    async deactivate(id){
        const budget = await knex('budgets')
            .where({id})
            .update({
                deleted_at: knex.fn.now()
            })
            .returning('*');

        return budget[0];
    }

    async activate(id){
        const budget = await knex('budgets')
            .where({id})
            .update({
                deleted_at: null
            })
            .returning('*');

        return budget[0];
    }
}

module.exports = new BudgetsRepository();