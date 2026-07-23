const bcrypt = require("bcrypt");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  const passwordHash = await bcrypt.hash("123456", 10);

  await knex("users").insert([
    {
      name: "Administrador",
      email: "admin@admin.com",
      password_hash: passwordHash,
      role: "admin",
    },
  ]);
};