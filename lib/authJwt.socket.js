const jwt = require("jsonwebtoken");

module.exports.verifyTokenIO = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SEED, (err, decode) => {
      if (err) {
        reject(err);
      } else {
        resolve(decode);
      }
    });
  });
};
