const express = require("express");
const PORT = 8080;
const mongoose = require("mongoose");
const key = require("./config/key");

const app = express();

const authRoutes = require("./routes/auth");

app.use("/blood", authRoutes);

mongoose
  .connect(key.MongoURI, () => {
    console.log(`DB connected`);
  })
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
