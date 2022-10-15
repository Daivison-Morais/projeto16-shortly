import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./src/routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(router);

app.get("/status", async (req, res) => {
  res.send("ooooook");
});

app.listen(process.env.PORT, () => {
  console.log("app running on port " + process.env.PORT);
});
