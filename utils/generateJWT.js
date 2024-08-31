const jwt = require("jsonwebtoken");

const generateToken = (userData) => {
  const payload = userData;

  const accessTokenOptions = {
    expiresIn: "1h",
  };

  const refreshTokenOptions = {
    expiresIn: "7d",
  };

  const accessTokenSecret = process.env.SECRET_KEY;
  const refreshTokenSecret = process.env.SECRET_KEY_REFRESH;

  const accessToken = jwt.sign(payload, accessTokenSecret, accessTokenOptions);
  const refreshToken = jwt.sign(
    payload,
    refreshTokenSecret,
    refreshTokenOptions
  );

  return { accessToken, refreshToken };
};

module.exports = generateToken;
