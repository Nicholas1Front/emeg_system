const knex = require('../../database/knex');

class FinancialRepository{
    async createRecord({
        user_id,
        category_id,
        description,
        amount,
        type,
        date_reference
    }){
        const record = await knex('financial_transactions')
            .insert({
                user_id,
                category_id,
                description,
                amount,
                type,
                date_reference
            }).returning('*');

        return record[0]
    }

    async createCategory({
        user_id,
        title,
        description,
        type
    }){
        const category = await knex('financial_categories')
            .insert({
                user_id,
                title,
                description,
                type
            }).returning('*');

        return category[0]
    }


    async updateRecord({
        id,
        recordData
    }){
        const record = await knex('financial_transactions').where({id}).update({
            ...recordData,
            updated_at : knex.fn.now()
        }).returning('*');

        return record[0]
    }

    async updateCategory({
        id,
        categoryData
    }){
        const category = await knex('financial_categories').where({id})
            .update({
                ...categoryData,
                updated_at : knex.fn.now()
            }).returning('*');

        return category[0]
    }

    async getRecords({
        user_id,
        month_start,
        month_end,
        year_start,
        year_end,
        date_reference_start,
        date_reference_end,
        type,
        amount
    }){

        const records = knex('financial_transactions');

        if(user_id !== undefined){
            records.where({user_id})
        }

        if(month_start !== undefined && month_end !== undefined){
            records.whereBetween(knex.raw('EXTRACT(MONTH FROM date_reference)'), [month_start, month_end]);
        }

        if(month_start !== undefined && month_end === undefined){
            records.where(knex.raw('EXTRACT(MONTH FROM date_reference)'), month_start);
        }

        if(month_start === undefined && month_end !== undefined){
            records.where(knex.raw('EXTRACT(MONTH FROM date_reference)'), month_end);
        }

        if(year_start !== undefined && year_end !== undefined){
            records.whereBetween(knex.raw('EXTRACT(YEAR FROM date_reference)'), [year_start, year_end]);
        }

        if(year_start !== undefined && year_end === undefined){
            records.where(knex.raw('EXTRACT(YEAR FROM date_reference)'), year_start);
        }

        if(year_start === undefined && year_end !== undefined){
            records.where(knex.raw('EXTRACT(YEAR FROM date_reference)'), year_end);
        }

        if(date_reference_start !== undefined && date_reference_end !== undefined){
            records.whereBetween('date_reference', [date_reference_start, date_reference_end]);
        }

        if(date_reference_start !== undefined && date_reference_end === undefined){
            records.where('date_reference', '>=', date_reference_start);
        }
        
        if(date_reference_start === undefined && date_reference_end !== undefined){
            records.where('date_reference', '<=', date_reference_end);
        }

        if(type !== undefined){
            records.where({type});
        }

        if(amount !== undefined){
            records.where({amount});
        }

        return records.orderBy('date_reference', 'asc');
    }

    async getCategories({
        user_id,
        id,
        title,
        description,
        type,
        includedDeactivated
    }){
        const categories = knex('financial_categories');

        if(!includedDeactivated || includedDeactivated === undefined){
            categories.whereNull('deleted_at');
        }

        if(includedDeactivated){
            categories.whereNotNull('deleted_at');
        }

        if(id !== undefined){
            categories.where({id})
        }

        if(user_id !== undefined){
            categories.where({user_id})
        }

        if(title !== undefined){
            categories.where('title', 'ilike', `%${title}%`);
        }

        if(description !== undefined){
            categories.where('description', 'ilike', `%${description}%`);
        }

        if(type !== undefined){
            categories.where({type});
        }

        return categories.orderBy('id', 'asc');
    }

    async deleteRecord(id){
        await knex('financial_transactions').where({id}).del();

        return true
    }

    async deactivateCategory(id){
        const category = await knex('financial_categories').where({id}).update({deleted_at: knex.fn.now()});

        return category
    }

    async activateCategory(id){
        const category = await knex('financial_categories').where({id}).update({deleted_at: null});

        return category
    }
}

module.exports = new FinancialRepository();