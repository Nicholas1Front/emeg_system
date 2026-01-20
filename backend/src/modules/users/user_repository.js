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
    async findById(id){
        const user = await knex('users')
        .where({id})
        .first();

        return user;
    }
    async findByEmail(email){
        const user = await knex('users')
        .where({email})
        .first();

        return user;
    }
    async findAll(){
        const users = await knex('users').select('*');

        return users;
    }
    async updateById(id, data){
        const user = await knex('users')
        .where({id})
        .update({
            name : data.name,
            email : data.email,
            password_hash : data.password
        })
        .returning(['id', 'name', 'email', 'role', 'created_at', 'updated_at']);

        return user[0];
    }
    async deleteById(id){
        const user = await knex('users')
        .where({id})
        .delete()

        return user;
    }

    async updateRole(id, role){
        const [user] = await knex('users')
        .where({id})
        .update({role})
        .returning('*');

        return user
    }
}

module.exports = new UserRepository();