const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  name: String,
  userID: String,
  password: String,
  phone: String,
  email: String
});

module.exports = mongoose.model('User',UserSchema);