import connection from "../conectionPG.js";

async function getRanking(req, res) {
  const result = await connection.query(
    `   SELECT 
    users.id, users.name, 
    COUNT(url) AS "linksCount", 
    SUM(visits) AS "visitCount"
FROM users 
 LEFT JOIN urls ON urls."userId" = users.id 
GROUP BY users.id 
ORDER BY "visitCount" DESC
LIMIT 10 
   ;`
  );

  result.rows.forEach((value) =>
    value.visitCount === null ? (value.visitCount = 0) : value
  );

  const resultOrden = result.rows.sort((a, b) => {
    if(a.visitCount > b.visitCount){
     return -1;
    } else{
      return true
    }
})

  res.status(200).send(resultOrden);
}

export default getRanking;
