const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  const token = authHeader.split(" ")[1]; //this is token from front
  let decodedToken;
  try {
    decodedToken = await jwt.verify(token, "somesupersecretsecret");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("인증되지 않았습니다. ");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
