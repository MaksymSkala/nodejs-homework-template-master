import mongoose from "mongoose";
import app from "./app.js";
import config from './models/contacts/config.js';

const DB_HOST = config.MONGODB_URI;

mongoose.connect(DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
  .then(() => {
    console.log("Database connection successful");
    app.listen(config.PORT, () => {
      console.log(`Server running. Use our API on port: ${config.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
    process.exit(1);
  });