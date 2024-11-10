const { users, paymentInfoTable } = require("../model/index");

const addPaymentInfo = async (req, res) => {
  const { u_id, acc_no, acch_name, bank } = req.body;

  console.log("info", req.body);

  try {
    const existingUser = await users.findOne({
      where: {
        u_id,
      },
    });

    if (!existingUser) {
      return res.status(400).json({
        message: "User does not exist, Unable to add payment info",
      });
    }

    const newPaymentInfo = await paymentInfoTable.create({
      u_id,
      acc_no,
      acch_name,
      bank,
    });

    if (newPaymentInfo) {
      return res.status(200).json({
        message: "New Payment Info added successfully",
        data: newPaymentInfo,
      });
    } else {
      return res.status(400).json({
        message: "Payment Info addition failed",
      });
    }
  } catch (error) {
    console.log("Payment Info addition error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  addPaymentInfo,
};
