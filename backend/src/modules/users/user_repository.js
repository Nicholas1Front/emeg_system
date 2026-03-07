const knex = require('../../database/knex');

class UserRepository {
    async create(userData){
        const user = await knex('users').insert({
            name : userData.name,
            email : userData.email,
            password_hash : userData.password,
            role : userData.role
        }).returning(['id', 'name', 'email', 'role', 'created_at', 'updated_at']);

        return user[0];
    }
    async find({
        id,
        email,
        name,
        role,
        includedDeactivated
    }){
        const query = await knex('users');

        if(includedDeactivated === false){
            query.whereNull('deleted_at');
        }

        if(includedDeactivated === true){
            query.whereNotNull('deleted_at');
        }

        if(id !== undefined){
            query.where('id', id);
        }

        if(email !== undefined){
            query.where('email', email);
        }

        if(name !== undefined){
            query.where('name', name);
        }

        if(role !== undefined){
            query.where('role', role);
        }

        return query.orderBy('id','desc');
    }
    async updateById({
        id, 
        data
    }){
        const user = await knex('users')
        .where({id})
        .update({
            ...data,
            updated_at : knex.fn.now()
        })
        .returning('*');

        return user[0];
    }

    async updateRole(id, role){
        const [user] = await knex('users')
        .where({id})
        .update({role})
        .returning('*');

        return user
    }
    async deactivate(id){
        const user = await knex('users')
        .where({id})
        .update({
            deleted_at : knex.fn.now()
        })
        .returning('*');

        return user[0];
    }

    async activate(id){
        const user = await knex('users')
        .where({id})
        .update({
            deleted_at : null
        })
        .returning('*');

        return user[0];
    }
}

module.exports = new UserRepository();