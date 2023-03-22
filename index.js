import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import registerRoutes from "./routes/auth.js";
import loginRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: true, credentials: true }));

app.use("/api/user/", registerRoutes);
app.use("/api/user/", loginRoutes);

app.listen(PORT, () => {
  console.log(`server is connected on port ${PORT}`);
});
