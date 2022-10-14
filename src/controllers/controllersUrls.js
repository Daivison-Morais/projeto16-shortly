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

async function getOneUrl(req, res) {
  const urlId = req.params.id;

  const url = await connection.query(
    `SELECT id, url, "shortUrl" FROM urls WHERE id = $1;`,
    [urlId]
  );

  if (url.rows.length === 0) {
    return res.status(404).send({ error: "url não encontrada" });
  }

  res.status(200).send(url.rows[0]);
}

async function getOpenUrl(req, res) {
  const shortUrl = req.params.shortUrl;

  try {
    const shortUrlExist = await connection.query(
      `SELECT * FROM urls WHERE "shortUrl" = $1;`,
      [shortUrl]
    );
    if (shortUrlExist.rows.length === 0) {
      return res.status(404).send({ error: "shortUrl não encontrada" });
    }

    const numberVisits = shortUrlExist.rows[0].visits + 1;

    await connection.query(
      `UPDATE urls SET visits = $1 WHERE "shortUrl" = $2;`,
      [numberVisits, shortUrl]
    );

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function deleteUrl(req, res) {
  const urlId = req.params.id;

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const { userId } = (
      await connection.query(
        `SELECT "userId" FROM sessions WHERE token = $1;`,
        [token]
      )
    ).rows[0];

    const urlEhUser = (
      await connection.query(`SELECT * FROM urls WHERE "id" = $1;`, [urlId])
    ).rows;
    if (urlEhUser.length === 0) {
      return res.sendStatus(409);
    }

    if (urlEhUser[0].userId !== userId) {
      return res.status(401).send({ error: "url não pertence ao usuário" });
    }

    await connection.query(`DELETE FROM urls WHERE id = $1;`, [urlId]);
    res.status(204).send({ result: "url deletada" });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { postShorten, getOneUrl, getOpenUrl, deleteUrl };
