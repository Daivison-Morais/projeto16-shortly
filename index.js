import express from "express";
import cors from "cors";
import { postSignup, getSignin } from "./src/controllers/controllersAuth.js";
import { postShorten, getOneUrl } from "./src/controllers/controllersUrls.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/signup", postSignup);
app.post("/signin", getSignin);

app.post("/urls/shorten", postShorten);
app.get("/urls/:id", getOneUrl);

app.get("/status", async (req, res) => {
  res.send("ooooook");
});

app.listen(process.env.PORT, () => {
  console.log("app running on port " + process.env.PORT);
});
