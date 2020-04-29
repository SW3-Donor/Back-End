const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const key = require('./config/key');

const PORT = process.env.PORT || 8888;
const user = 'asdfadsfdsafsads';

app.use(bodyParser());
mongoose.connect(key.MongoURI,() => {
  console.log("Connected MongoDB");
});

app.get('/', (req,res) => {
  res.status(200).send(usfffer);
  if(res.status(500)) return res.send("에러");
})

app.listen(PORT, () => {
  console.log(`My Server is running on ${PORT}`);
});