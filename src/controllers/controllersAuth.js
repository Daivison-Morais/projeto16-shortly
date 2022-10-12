import connection from "../conectionPG.js";
import joi from "joi";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const postSignupSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  confirmPassword: joi.string().required(),
});

async function postSignup(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(409).send({ erro: "senhas imcompatíveis!" });
  }

  const validation = postSignupSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const errors = validation.error.details.map((value) => value.message);
    return res.status(422).send(errors);
  }

  try {
    const findEmail = (
      await connection.query(`SELECT * FROM users WHERE email = $1;`, [email])
    ).rows;
    if (findEmail.length > 0) {
      return res.status(409).send({ erro: "Email já cadastrado!" });
    }

    const passwordEncrypted = bcrypt.hashSync(password, 10);
    console.log(passwordEncrypted);

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
}

export { postSignup, getSignin };
