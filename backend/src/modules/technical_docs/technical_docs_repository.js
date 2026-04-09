const knex = require('../../database/knex');

class TechnicalDocsRepository{
    async create({
        client_id,
        work_order_id,
        user_id,
        title,
        type,
        description,
        status,
        responsible_name,
        responsible_role,
        responsible_document,
        is_signed,
        signature_url,
    }){
        const doc = await knex('technical_docs').insert({
            client_id,
            work_order_id,
            user_id,
            title,
            type,
            description,
            status,
            responsible_name,
            responsible_role,
            responsible_document,
            is_signed,
            signature_url,
        }).returning('*');

        return doc[0]
    }

    async update({
        id,
        docData
    }){
        const doc = await knex('technical_docs')
            .where({id})
            .update({
                ...docData,
                updated_at : knex.fn.now()
            }).returning('*');

        return doc[0];
    }

    async find({
        id,
        client_id,
        work_order_id,
        title,
        status,
        responsible_name,
        is_signed,
        includedDeactivated,
        created_at_start,
        created_at_end
    }){
        const query = knex('technical_docs');

        if(!includedDeactivated || includedDeactivated === undefined){
            query.whereNull('deleted_at');
        }

        if(includedDeactivated){
            query.whereNotNull('deleted_at');
        }

        if(id !== undefined){
            query.where({id});
        }

        if(client_id !== undefined){
            query.where({client_id});
        }

        if(work_order_id !== undefined){
            query.where({work_order_id});
        }

        if(title !== undefined){
            query.where('title', 'ilike', `%${title}%`);
        }

        if(status !== undefined){
            query.where({status});
        }

        if(responsible_name !== undefined){
            query.where('responsible_name', 'ilike', `%${responsible_name}%`);
        }

        if(is_signed !== undefined || is_signed){
            query.where({is_signed});
        }

        if(created_at_start !== undefined && created_at_end !== undefined){
            query.whereBetween('created_at', [created_at_start, created_at_end]);
        }

        if(created_at_start !== undefined && created_at_end === undefined){
            query.where('created_at', '>=', created_at_start);
        }

        if(created_at_start === undefined && created_at_end !== undefined){
            query.where('created_at', '<=', created_at_end);
        }

        return query.orderBy('created_at', 'desc');
    }

    async deactivate(id){
        const doc = await knex('technical_docs')
            .where({id})
            .update({
                deleted_at : knex.fn.now()
            }).returning('*');

        return doc[0];
    }

    async activate(id){
        const doc = await knex('technical_docs')
            .where({id})
            .update({
                deleted_at : null
            }).returning('*');

        return doc[0];
    }
}

module.exports = new TechnicalDocsRepository();