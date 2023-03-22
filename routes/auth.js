import express from "express";
const router = express.Router();

import { register, login, logOut } from "../controllers/auth.js";

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logOut);

export default router;
