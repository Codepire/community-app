const jwt = require("jsonwebtoken");

//================================
// Verify Token Middleware
//================================
/**
 * Middleware to verify the authenticity of the client's JWT
 * @param req - Intercepts the client's request to verify the JWT
 * @param res - Response in case of any error occurring
 * @param next - Continues with the execution if there are no errors
 */
let verifyToken = (req, res, next) => {
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

module.exports = {
  verifyToken,
};
