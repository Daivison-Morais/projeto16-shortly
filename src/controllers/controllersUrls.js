import connection from "../conectionPG.js";
import joi from "joi";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

const postShortenSchema = joi.object({
  url: joi.string().uri().required(),
});

async function postShorten(req, res) {
  const { url } = req.body;

  const validation = postShortenSchema.validate({ url });
  if (validation.error) {
    const error = validation.error.details[0].message;
    return res.status(422).send(error);
  }

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.sendStatus(401);
  }

  const newUrl = nanoid(8);

  try {
    const { userId } = (
      await connection.query(
        `SELECT "userId" FROM sessions WHERE token = $1;`,
        [token]
      )
    ).rows[0];

    await connection.query(
      `INSERT INTO urls (url, "shortUrl", "userId") VALUES ($1, $2, $3)`,
      [url, newUrl, userId]
    );

    res.status(201).send({ shortUrl: newUrl });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function getOneUrl(req, res) {}

export { postShorten, getOneUrl };
