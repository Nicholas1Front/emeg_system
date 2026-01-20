const knex = require('../../database/knex');

class AuthRepository {
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
}

module.exports = new AuthRepository();