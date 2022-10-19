import pg from "pg";

const { Pool } = pg;

/* const databaseConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const connection = new Pool(databaseConfig); */

const connection = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "1441",
  database: "shortly",
});

export default connection;
