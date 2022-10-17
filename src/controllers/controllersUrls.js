import connection from "../conectionPG.js";
import { nanoid } from "nanoid";

async function postShorten(req, res) {
  const token = res.locals.token;
  const url = res.locals.url;

  const newUrl = nanoid(8);

  try {
    const userId = (
      await connection.query(
        `SELECT "userId" FROM sessions WHERE token = $1;`,
        [token]
      )
    ).rows;

    if (userId.length === 0) {
      return res.send({ error: "usuário não encontrado" });
    }

    await connection.query(
      `INSERT INTO urls (url, "shortUrl", "userId") VALUES ($1, $2, $3)`,
      [url, newUrl, userId[0].userId]
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

    res.redirect(shortUrlExist.rows[0].url);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function deleteUrl(req, res) {
  const urlId = req.params.id;
  const token = res.locals.token;

  try {
    const session = (
      await connection.query(
        `SELECT "userId" FROM sessions WHERE token = $1;`,
        [token]
      )
    ).rows;
    if (session.length === 0) {
      return res.status(404).send({ error: "sessão não encontrada" });
    }

    const urlEhUser = (
      await connection.query(`SELECT * FROM urls WHERE "id" = $1;`, [urlId])
    ).rows;
    if (urlEhUser.length === 0) {
      return res.sendStatus(404);
    }

    if (urlEhUser[0].userId !== session[0].userId) {
      return res.status(401).send({ error: "url não pertence ao usuário" });
    }

    await connection.query(`DELETE FROM urls WHERE id = $1;`, [urlId]);
    res.status(204).send({ result: "url deletada" });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function getUsersMe(req, res) {
  const token = res.locals.token;

  try {
    const session = (
      await connection.query(
        `SELECT "userId" FROM sessions WHERE token = $1;`,
        [token]
      )
    ).rows;
    if (session.length === 0) {
      return res.status(404).send({ error: "sessão não encontrada" });
    }

    const user = await connection.query(
      `SELECT users.id, users.name, urls.* FROM users JOIN urls ON users.id = urls."userId" WHERE urls."userId" = $1;`,
      [session[0].userId]
    );

    if (user.rows[0]?.url === undefined) {
      return res.status(404).send({ erro: "sem links encurtados" });
    }

    let maxVisits = 0;
    user.rows.forEach((value) => (maxVisits = maxVisits + value.visits));

    const details = user?.rows.map((value) => ({
      id: value.id,
      shortUrl: value.shortUrl,
      url: value.url,
      visitCount: value.visits,
    }));

    const result = {
      id: user.rows[0].userId,
      name: user.rows[0].name,
      visitCount: maxVisits,
      shortenedUrls: details,
    };

    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { postShorten, getOneUrl, getOpenUrl, deleteUrl, getUsersMe };
