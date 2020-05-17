const express = require("express");
const PORT = 8080;

const app = express();

const authRoutes = require("./routes/auth");

app.use("/blood", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
