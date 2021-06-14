const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();
mongoose
  .connect(process.env.MONDO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to the DB"))
  .catch((error) => console.error(error));

app.use(express.json());
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

app.listen(3000, () => console.log("Server up and running"));
