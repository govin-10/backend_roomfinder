const jwt = require("jsonwebtoken");

const verifyAccessJWT = (req, res, next) => {
  const authorization = req.headers.authorization;

  console.log("authorization", authorization);

  if (!authorization) {
    return res.status(401).json({
      message: "Unauthorized access",
      error: "Token not found",
    });
  }

  try {
    const token = authorization.split(" ")[1];

    if (token) {
      const verifiedToken = jwt.verify(token, process.env.SECRET_KEY);

      console.log("verifiedToken", verifiedToken);

      req.user = verifiedToken;
      next();
    }
  } catch (error) {
    // throw new Error("JWT expired or invalid");
    console.log("errorrrrrr", error.name);
    return res.status(401).json({
      message: "Unauthorized access",
      error: "Token expired or invalid",
    });
  }
};

const verifyRefreshJWT = (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Unauthorized access",
      error: "Token not found",
    });
  }

  try {
    const verifiedToken = jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH
    );

    console.log("verifiedToken reff", verifiedToken);

    req.user = verifiedToken;
    next();
  } catch (error) {
    // throw new Error("JWT expired or invalid");
    return res.status(401).json({
      message: "Unauthorized access from refresh",
      error: "Token expired or invalid",
    });
  }
};

module.exports = { verifyAccessJWT, verifyRefreshJWT };
