import express from "express";
import { postSignup, getSignin } from "./controllers/controllersAuth.js";
import {
  postShorten,
  getOneUrl,
  getOpenUrl,
  deleteUrl,
  getUsersMe,
} from "./controllers/controllersUrls.js";
import getRanking from "./controllers/controllersRanking.js";
import { validUrl } from "./middlewares/middlewareSchema.js";
import { validToken } from "./middlewares/middlewaresUrls.js";

const router = express.Router();
router.post("/signup", postSignup);
router.post("/signin", getSignin);

router.post("/urls/shorten", validToken, validUrl, postShorten);
router.get("/urls/:id", getOneUrl);
router.get("/urls/open/:shortUrl", getOpenUrl);
router.delete("/urls/:id", deleteUrl);

router.get("/users/me", getUsersMe);

router.get("/ranking", getRanking);

export default router;
