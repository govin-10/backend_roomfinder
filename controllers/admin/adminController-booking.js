const { users, bookingTable, roomTable } = require("../../model");

const allBookings = async (req, res) => {
  const user = req.user;
  const existingUser = await users.findOne({
    where: {
      u_id: user.id,
    },
  });

  if (!existingUser || existingUser.role !== "admin") {
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

    const bookingData = await Promise.all(
      bookings.map(async (booking) => {
        const room = await roomTable.findOne({
          where: {
            r_id: booking.r_id,
          },
        });

        const requester = await users.findOne({
          where: {
            u_id: booking.u_id,
          },
          attributes: ["u_id", "full_name", "email", "phone"], // Select relevant fields
        });

        const owner = await users.findOne({
          where: {
            u_id: booking.owner_id,
          },
          attributes: ["u_id", "full_name", "email", "phone"], // Select relevant fields
        });

        return {
          booking_id: booking.b_id,
          roomDetails: room,
          requestedBy: requester,
          bookingInfo: booking,
          roomOwner: owner,
        };
      })
    );

    return res.status(200).json({
      message: "All bookings fetched successfully",
      data: bookingData,
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
