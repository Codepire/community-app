const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    let token = req.get("Authorization");
    jwt.verify(token, process.env.JWT_SEED, (err, decode) => {
      if (err) {
        return res.status(401).json({ response: err });
      }
      req.user = decode;
      next();
    });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

const verifyTokenIO = (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    jwt.verify(token, process.env.JWT_SEED, (err, decode) => {
      if (err) {
        throw new Error("Authorization failed in socket verification!");
      } else {
        socket.userId = decode.id;
        next();
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  verifyToken,
  verifyTokenIO,
};
