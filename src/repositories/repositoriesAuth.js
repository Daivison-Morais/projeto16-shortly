import connection from "../conectionPG.js";

async function insertUser({ name, email, passwordEncrypted }) {
  const result = await connection.query(
    `INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,
    [name, email, passwordEncrypted]
  );
  return result;
}
export { insertUser };
