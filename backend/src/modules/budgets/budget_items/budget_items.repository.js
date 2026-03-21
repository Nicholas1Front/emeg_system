const knex = require('../../../database/knex');

class BudgetItemsRepositoty{
    async create({
        budget_id,
        name,
        unit_price,
        quantity,
        base_price,
        final_price,
        discount_percent
    }){
        const budgetItem = await knex('budget_items')
            .insert({
                budget_id,
                name,
                unit_price,
                quantity,
                base_price,
                final_price,
                discount_percent
            }).returning('*');

        return budgetItem[0];
    }

    async update({
        id,
        budgetItemData
    }){
        const budgetItem = await knex('budget_items')
            .where({id})
            .update({
                ...budgetItemData,
                updated_at: knex.fn.now()
            }).returning('*');

        return budgetItem[0];
    }

    async find({
        id,
        budgetId
    }){
        const query = await knex('budget_items').select('*');

        if(id !== undefined){
            query.where({id});
        }

        if(budgetId !== undefined){
            query.where({budget_id : budgetId});
        }

        return query.orderBy('id', 'asc');
    }

    async delete(id){
        await knex('budget_items').where({id}).delete();

        return true;
    }
}

module.exports = new BudgetItemsRepositoty();