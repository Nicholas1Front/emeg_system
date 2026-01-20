const knex = require('knex');

const db = knex({
    client : "pg",
    connection : process.env.DATABASE_URL,
    pool : {
        min : 2,
        max : 10
    }
});

db.raw('select 1')
    .then(()=>{
        console.log("Database connected successfully.");
    })
    .catch((error)=>{
        console.error("Database connection failed:", error);
    })

module.exports = db;