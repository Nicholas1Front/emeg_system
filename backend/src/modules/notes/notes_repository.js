const knex = require('../../database/knex');

class NotesRepository{
    async create({
        title,
        content,
        creator_id,
        date_reference
    }){
        const note = await knex('notes').insert({
            title,
            content,
            creator_id,
            date_reference
        }).returning('*');

        return note[0]
    }

    async update({
        id,
        title,
        content,
        date_reference, 
    }){
        const note = await knex('notes')
        .where({id})
        .update({
            title,
            content,
            date_reference
        })
        .returning('*');

        return note[0];
    }

    async find({
        id,
        creator_id,
        date_reference_start,
        date_reference_end
    }){
        const query = knex('notes');

        if(id){
            query.where({id});
        }

        if(creator_id){
            query.where('creator_id', creator_id);
        }

        if(date_reference_start && date_reference_end){
            query.whereBetween('date_reference', [date_reference_start, date_reference_end]);
        }

        if(date_reference_start && !date_reference_end){
            query.where('date_reference', '>=', date_reference_start);
        }

        if(!date_reference_start && date_reference_end){
            query.where('date_reference', '<=', date_reference_end);
        }

        return query.orderBy('date_reference', 'desc');
    }

    async delete({id}){
        return await knex('notes').where({id}).delete();
    }
}

module.exports = new NotesRepository();