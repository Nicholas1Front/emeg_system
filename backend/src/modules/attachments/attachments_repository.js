const knex = require('../../database/knex');

class AttachmentsRepository{
    async create(data){
        const attachment = await knex('attachments').insert(data).returning('*');

        return attachment[0];
    }

    async find(filters){
        const query = knex('attachments');

        if(filters.id !== undefined){
            query.where('id', filters.id);
        }

        if(filters.entity_type !== undefined){
            query.where('entity_type', filters.entity_type);
        }

        if(filters.entity_id !== undefined){
            query.where('entity_id', filters.entity_id);
        }

        if(filters.original_name !== undefined){
            query.where('original_name', filters.original_name);
        }

        if(filters.mime_type !== undefined){
            query.where('mime_type', filters.mime_type);
        }

        if(filters.size !== undefined){
            query.where('size', filters.size);
        }

        if(filters.created_by !== undefined){
            query.where('created_by', filters.created_by);
        }

        return query.orderBy('created_at', 'desc');
    }

    async delete(id){
        return await knex('attachments').where({id}).delete();
    }
}

module.exports = new AttachmentsRepository();