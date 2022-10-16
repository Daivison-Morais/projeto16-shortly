import connection from "../conectionPG.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const token = uuidv4();

async function postSignup(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(409).send({ erro: "senhas imcompatíveis!" });
  }

  try {
    const findEmail = (
      await connection.query(`SELECT * FROM users WHERE email = $1;`, [email])
    ).rows;
    if (findEmail.length > 0) {
      return res.status(409).send({ erro: "Email já cadastrado!" });
    }

    const passwordEncrypted = bcrypt.hashSync(password, 10);

    await connection.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,
      [name, email, passwordEncrypted]
    );

    res.status(201).send("cadastro realizado com sucesso!");
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function getSignin(req, res) {
  const { email, password } = req.body;

  try {
    const findUser = (
      await connection.query(`SELECT * FROM users WHERE email = $1;`, [email])
    ).rows;

    if (findUser.length === 0) {
      return res.status(401).send({ error: "usuário não encontrado" });
    }
    const isValid = bcrypt.compareSync(password, findUser[0].password);
    if (!isValid) {
      return res.status(401).send({ error: "Senha inválida" });
    }

    await connection.query(
      `INSERT INTO sessions ("userId", token) VALUES ($1, $2);`,
      [findUser[0].id, token]
    );

    res.status(200).send({ token });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { postSignup, getSignin };
