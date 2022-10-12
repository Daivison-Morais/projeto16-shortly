import pkg from "pg";

const { Pool } = pkg;
const connection = new Pool({
  host: process.env.DATABASE_URL,
  port: 5432,
  user: "postgres",
  password: "1441",
  database: "shortly",
});

export default connection;
