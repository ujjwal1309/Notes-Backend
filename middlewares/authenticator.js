const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticator = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.secret, (err, decoded) => {
      if (decoded) {
        req.body.user=decoded.userId;
        next();
      } else {
        res.send({ msg: "Login First" });
      }
    });
  } else {
    res.send({ msg: "Login First" });
  }
};

module.exports={authenticator};
