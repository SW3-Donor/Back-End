const express = require("express");
const PORT = 8080;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const key =
  "mongodb+srv://David:!sdh0919@cluster0-ozgw6.mongodb.net/test?retryWrites=true&w=majority";

const app = express();

const authRoutes = require("./routes/auth");
const bloodRoutes = require("./routes/blood");

app.use(bodyParser.json());

//Header setting
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "GET, POST, PUT, PATCH, DELETE",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.use("/auth", authRoutes);
app.use("/blood", bloodRoutes);

mongoose
  .connect(key, () => {
    console.log(`DB connected`);
  })
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
