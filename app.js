import express from "express";
import logger from "morgan";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import contactsRouter from "./routes/api/contacts-router.js";
import usersRouter from "./routes/api/users-router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/avatars', express.static(path.join(__dirname, 'public', 'avatars')));

app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;