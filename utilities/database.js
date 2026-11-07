const { Pool } = require("pg");
const { loadEnvFile } = require("node:process");
loadEnvFile();

const SQL = `CREATE TABLE IF NOT EXISTS Users (
   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   first_name VARCHAR(75),
   last_name VARCHAR(75),
   email VARCHAR(255) UNIQUE,
   password_hash VARCHAR(255),
   membership_status TEXT,
   admin_status BOOLEAN
);

CREATE TABLE IF NOT EXISTS Messages (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(50),
    created_at TIMESTAMPTZ,
    message_text TEXT,
    author_id INTEGER REFERENCES Users(id)
);`;

const pgPool = new Pool({
  connectionString: process.env.LOCAL_CONNECTION_STRING,
});

async function insertCredentialsIntoDb(
  firstName,
  lastName,
  email,
  hashedPassword,
) {
  const membershipStatus = "Newbie";
  const result = await pgPool.query(
    "INSERT INTO Users (first_name, last_name, email, password_hash, membership_status, admin_status) VALUES ($1, $2, $3, $4, $5, FALSE) RETURNING *",
    [firstName, lastName, email, hashedPassword, membershipStatus],
  );
  return result.rows[0];
}

module.exports = { pgPool, insertCredentialsIntoDb };
