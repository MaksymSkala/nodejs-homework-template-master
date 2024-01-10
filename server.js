import mongoose from "mongoose";
import app from "./app.js";

// aykewe41QJwgaCxG
const DB_HOST = "mongodb+srv://MaxS:aykewe41QJwgaCxG@cluster0.skedj19.mongodb.net/my-contacts?retryWrites=true&w=majority";

mongoose.connect(DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
  .then(() => {
    console.log("Database connection successful");
    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
    process.exit(1);
  });