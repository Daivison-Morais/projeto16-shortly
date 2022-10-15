import express from "express";
import cors from "cors";
import { postSignup, getSignin } from "./src/controllers/controllersAuth.js";
import {
  postShorten,
  getOneUrl,
  getOpenUrl,
  deleteUrl,
  getUsersMe,
} from "./src/controllers/controllersUrls.js";
import getRanking from "./src/controllers/controllersRanking.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/signup", postSignup);
app.post("/signin", getSignin);

app.post("/urls/shorten", postShorten);
app.get("/urls/:id", getOneUrl);
app.get("/urls/open/:shortUrl", getOpenUrl);
app.delete("/urls/:id", deleteUrl);

app.get("/users/me", getUsersMe);

app.get("/ranking", getRanking);

app.get("/status", async (req, res) => {
  res.send("ooooook");
});

app.listen(process.env.PORT, () => {
  console.log("app running on port " + process.env.PORT);
});
