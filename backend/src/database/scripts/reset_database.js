const knex = require('../knex');

async function resetDatabase(){
    await knex.raw(`
        TRUNCATE TABLE users RESTART IDENTITY CASCADE;    
    `);

    console.log("Database reset successfully.");
    process.exit(0);
}

resetDatabase();