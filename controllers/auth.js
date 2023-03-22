import { db } from "../db/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const register = (req, res) => {
  // CHECK IF USER ALREADY EXIST

  const q = "SELECT * FROM users WHERE email = ? OR username = ?";
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  db.query(q, [email, username], (err, data) => {
    if (err) return res.json(err);
    if (data.length) return res.status(409).json("user already exist !");

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const q = "INSERT INTO users(`username`,`email`,`password`) VALUES (?)";

    const values = [username, email, hash];
    console.log(values);

    db.query(q, [values], (err, data) => {
      if (err) return res.status(409).json(err);

      return res.status(200).json("user has been created ");
    });
  });
};

export const login = (req, res) => {
  //  CHECK IF USER ALREADY EXISTS

  const q = "SELECT * FROM users WHERE email = ? ";

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.json(err);
    if (data.length === 0) return res.status(404).json("user not found");

    // CHECK PASSWORD USING BCRYPT

    const isPasswordCorrect = bcrypt.compare(
      req.body.password,
      data[0].password
    );

    if (!isPasswordCorrect)
      return res.status(400).json("wrong email or password");

    // CREATE JWTs

    const accessToken = jwt.sign(
      { email: data[0].email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "90m" }
    );

    const refreshToken = jwt.sign(
      { email: data[0].email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" }
    );

    const { password, ...other } = data[0];

    res.cookie("access_token", JSON.stringify(refreshToken), {
      httpOnly: true,
      // sameSite: true,
      // signed: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken, other });
  });
};
export const logOut = (req, res) => {
  res.json("hello");
};
