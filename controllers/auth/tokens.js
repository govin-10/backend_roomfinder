const { Op } = require("sequelize");
const { refreshTokenTable } = require("../../model");
const generateToken = require("../../utils/generateJWT");

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;
  const payloadData = {
    id: req.user.id,
    email: req.user.email,
    phone: req.user.phone,
  };

  if (!refreshToken) {
    return res.status(401).json({
      message: "Unauthorized access",
      error: "Token not found",
    });
  }

  const allRefreshTokens = await refreshTokenTable.findAll({
    where: {
      u_id: payloadData.id,
      rt_expiry: {
        [Op.gt]: new Date(),
      },
      rt_status: true,
    },
    raw: true,
  });

  console.log("redddddd", allRefreshTokens);

  const parsedRefreshTokens = allRefreshTokens.map((token) => {
    return token.rt_token;
  });

  if (parsedRefreshTokens.includes(refreshToken)) {
    const newTokens = generateToken(payloadData);
    await refreshTokenTable.destroy({
      where: {
        rt_token: refreshToken,
      },
    });
    await refreshTokenTable.create({
      u_id: payloadData.id,
      rt_token: newTokens.refreshToken,
      rt_expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return res.status(200).json({
      message: "Token refreshed",
      data: {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      },
    });
  } else {
    return res.status(401).json({
      message: "Unauthorized access",
      error: "Token not found",
    });
  }
};

module.exports = { refreshAccessToken };
