const express = require("express");
const PORT = 8080;
const mongoose = require("mongoose");
const key =
  "mongodb+srv://David:!sdh0919@cluster0-ozgw6.mongodb.net/test?retryWrites=true&w=majority";

const app = express();

const authRoutes = require("./routes/auth");

app.use("/blood", authRoutes);

mongoose
  .connect(key, () => {
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
