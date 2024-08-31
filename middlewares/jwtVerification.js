const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      message: "Unauthorized access",
      error: "Token not found",
    });
  }

  try {
    const token = authorization.split(" ")[1];

    if (token) {
      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

      req.user = verifiedToken;
      next();
    }
  } catch (error) {
    throw new Error("JWT expired or invalid");
  }
};

module.exports = verifyJWT;
