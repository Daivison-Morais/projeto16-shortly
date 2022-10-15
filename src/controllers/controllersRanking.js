import connection from "../conectionPG.js";

async function getRanking(req, res) {
  const result = await connection.query(
    `   SELECT 
            users.id, users.name, 
            COUNT(url) AS "linksCount", 
            SUM(visits) AS "visitCount"
        FROM urls 
        JOIN users ON users.id = urls."userId"
        GROUP BY users.id 
        ORDER BY "visitCount" DESC
        LIMIT 10 
   ;
`
  );

  res.status(200).send(result.rows);
}

export default getRanking;
