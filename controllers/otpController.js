const generateOTP = require("../utils/generateOTP");
const { otpTable } = require("../model/index");

const requestOTP = async (req, res) => {
  const { phone } = req.body;

  const existingOtp = await otpTable.findOne({
    where: {
      phone,
      verified: true,
    },
  });

  console.log(existingOtp, "exists");

  if (existingOtp && existingOtp.verified) {
    console.log(existingOtp.dataValues);
    return res.status(400).json({
      message: "Phone number already verified",
    });
  }

  const otp = generateOTP();

  const expiry = new Date(new Date().getTime() + 1000 * 1000);

  const otpInfo = await otpTable.create({
    phone,
    otp,
    expiry,
  });

  if (otpInfo) {
    return res.status(200).json({
      message: "OTP sent successfully",
      data: otpInfo,
    });
  }
};

const verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;

  const existingOtp = await otpTable.findAll({
    where: {
      phone,
    },
    order: [["expiry", "DESC"]],
  });

  if (existingOtp.length === 0) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  const latestOtp = existingOtp[0].dataValues;
  const isExpired = new Date() > new Date(latestOtp.expiry);

  if (isExpired || latestOtp.otp !== otp) {
    return res.status(400).json({
      message: "OTP invalid or expired",
    });
  }

  await otpTable
    .update(
      {
        verified: true,
      },
      {
        where: {
          phone,
          otp,
        },
      }
    )
    .then(async () => {
      await otpTable.destroy({
        where: {
          phone,
          verified: false,
        },
      });
      console.log("OTP verified successfully");
    });

  return res.status(200).json({
    message: "OTP verified successfully",
  });
};

module.exports = { requestOTP, verifyOTP };
