import express from "express";
import cors from "cors";
import { getStatus, postSignup } from "./src/controllers/controllersAuth.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/signup", postSignup);

app.get("/status", getStatus);

app.listen(5000, () => {
  console.log("listen on 5000");
});
