import connection from "../conectionPG.js";

async function getStatus(req, res) {
  res.send("ooooook");
}

async function postSignup(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  res.status(201).send("ooooook");
}

export { getStatus, postSignup };
