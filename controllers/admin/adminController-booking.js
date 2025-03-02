const { where } = require("sequelize");
const { users, bookingTable } = require("../../model");

const allBookings = async (req, res) => {
  const user = req.user;
  const existingUser = await users.findOne({
    where: {
      u_id: user.id,
    },
  });

  if (!existingUser.role === "admin") {
    return res.status(403).json({
      message: "You are not authorized to view this stats",
    });
  }

  try {
    const bookings = await bookingTable.findAll();
    if (!bookings) {
      return res.status(404).json({
        message: "No bookings found",
      });
    }
    // const parsedBookings = bookings.map((booking) => booking.toJSON());
    return res.status(200).json({
      message: "All bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    console.log("Error in fetching bookings", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  allBookings,
};
