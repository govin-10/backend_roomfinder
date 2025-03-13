const { users, bookingTable, roomTable } = require("../../model");

const requestBooking = async (req, res) => {
  const user = req.user;

  const { owner_id } = req.body;

  const user_id = user.id;

  const existingUser = await users.findOne({
    where: {
      u_id: user_id,
    },
  });

  if (!existingUser || existingUser.role !== "renter") {
    return res.status(400).json({
      message: "No user to proceed with booking",
    });
  }

  const { room_id, price } = req.body;

  const existingRoom = await roomTable.findOne({
    where: {
      r_id: room_id,
    },
  });

  if (!existingRoom || existingRoom.room_status !== "available") {
    return res.status(400).json({
      message: "No room to proceed with booking",
    });
  }

  const existingBooking = await bookingTable.findOne({
    where: {
      r_id: room_id,
      u_id: user_id,
    },
  });

  if (existingBooking && existingBooking.booking_status === "approved") {
    return res.status(400).json({
      message:
        "You already have 1 booking approved. Cannot do more than 1 booking at a time",
    });
  }

  try {
    const booking = await bookingTable.create({
      u_id: user_id,
      total_price: price,
      r_id: room_id,
      owner_id,
    });

    if (booking) {
      return res.status(200).json({
        message: "Booking created successfully",
        data: booking,
      });
    } else {
      return res.status(400).json({
        message: "Booking creation failed",
      });
    }
  } catch (error) {
    console.log("booking creation error", error);
    return res.status(500).json({
      message: "Internal server error",
      errorData: error,
    });
  }
};

const acceptBooking = async (req, res) => {
  const user = req.user;
  const user_id = user.id;

  const existingUser = await users.findOne({
    where: {
      u_id: user_id,
    },
  });

  if (!existingUser || existingUser.role !== "homeOwner") {
    return res.status(400).json({
      message: "Only home owners can accept bookings",
    });
  }

  const { booking_id } = req.body;

  const existingBooking = await bookingTable.findOne({
    where: {
      b_id: booking_id,
    },
  });

  if (!existingBooking) {
    return res.status(400).json({
      message: "Booking not found",
    });
  }

  const existingRoom = await roomTable.findOne({
    where: {
      r_id: existingBooking.r_id,
    },
  });

  if (!existingRoom || existingRoom.u_id !== user_id) {
    return res.status(400).json({
      message: "You do not have permission to accept this booking",
    });
  }

  try {
    const updatedBooking = await existingBooking.update({
      booking_status: "approved",
    });

    if (updatedBooking) {
      // Change room status to occupied
      await existingRoom.update({
        room_status: "occupied",
      });

      // Delete other booking requests for the same room
      await bookingTable.destroy({
        where: {
          r_id: existingBooking.r_id,
          b_id: {
            [Sequelize.Op.ne]: booking_id,
          },
        },
      });

      return res.status(200).json({
        message: "Booking accepted successfully",
        data: updatedBooking,
      });
    } else {
      return res.status(400).json({
        message: "Booking acceptance failed",
      });
    }
  } catch (error) {
    console.log("Booking acceptance error", error);
    return res.status(500).json({
      message: "Internal server error",
      errorData: error,
    });
  }
};

const deleteBookingRequest = async (req, res) => {
  const user = req.user;
  const user_id = user.id;

  const existingUser = await users.findOne({
    where: {
      u_id: user_id,
    },
  });

  if (!existingUser || existingUser.role !== "homeOwner") {
    return res.status(400).json({
      message: "Only home owners can delete booking requests",
    });
  }

  const { booking_id } = req.body;

  const existingBooking = await bookingTable.findOne({
    where: {
      id: booking_id,
    },
  });

  if (!existingBooking) {
    return res.status(400).json({
      message: "Booking not found",
    });
  }

  const existingRoom = await roomTable.findOne({
    where: {
      r_id: existingBooking.r_id,
    },
  });

  if (!existingRoom || existingRoom.u_id !== user_id) {
    return res.status(400).json({
      message: "You do not have permission to delete this booking request",
    });
  }

  try {
    await bookingTable.destroy({
      where: {
        b_id: booking_id,
      },
    });

    return res.status(200).json({
      message: "Booking request deleted successfully",
    });
  } catch (error) {
    console.log("Booking deletion error", error);
    return res.status(500).json({
      message: "Internal server error",
      errorData: error,
    });
  }
};

const getBookingRequests = async (req, res) => {
  const user = req.user;
  const user_id = user.id;

  console.log("user_id", user_id);

  const existingUser = await users.findOne({
    where: {
      u_id: user_id,
    },
  });

  console.log("existingUser", existingUser);

  if (!existingUser || existingUser.role !== "homeOwner") {
    return res.status(400).json({
      message: "Only home owners can view booking requests",
    });
  }

  try {
    const bookingRequests = await bookingTable.findAll({
      where: {
        owner_id: user_id, // Fetch only the bookings owned by the home owner
      },
    });

    console.log("bookingrequests", bookingRequests);

    const bookingData = await Promise.all(
      bookingRequests.map(async (booking) => {
        const room = await roomTable.findOne({
          where: {
            r_id: booking.r_id,
          },
        });

        console.log("room", room);

        const requester = await users.findOne({
          where: {
            u_id: booking.u_id,
          },
          attributes: ["u_id", "full_name", "email", "phone"], // Select relevant fields
        });

        console.log("requester", requester);

        return {
          booking_id: booking.b_id,
          roomDetails: room,
          requestedBy: requester,
          bookingInfo: booking,
          // requester_id: requester.u_id,
          // requester_name: requester.name,
          // requester_email: requester.email,
          // requester_phone: requester.phone,
          // total_price: booking.total_price,
          // booking_status: booking.booking_status,
        };
      })
    );

    console.log("bookingrequests", bookingRequests);

    return res.status(200).json({
      message: "Booking requests fetched successfully",
      data: bookingData,
    });
  } catch (error) {
    console.error("Error fetching booking requests:", error);
    return res.status(500).json({
      message: "Internal server error",
      errorData: error,
    });
  }
};

const getRentersRequests = async (req, res) => {
  const user = req.user;
  const user_id = user.id;

  const existingUser = await users.findOne({
    where: {
      u_id: user_id,
    },
  });

  console.log("existingUser", existingUser);

  if (!existingUser || existingUser.role !== "renter") {
    return res.status(400).json({
      message: "Only renters can view their booking requests",
    });
  }

  try {
    const bookingRequests = await bookingTable.findAll({
      where: {
        u_id: user_id,
      },
    });

    console.log("bookingrequests", bookingRequests);

    return res.status(200).json({
      message: "Booking requests fetched successfully",
      data: bookingRequests,
    });
  } catch (error) {
    console.log("Error fetching booking requests", error);
    return res.status(500).json({
      message: "Internal server error",
      errorData: error,
    });
  }
};

module.exports = {
  requestBooking,
  acceptBooking,
  deleteBookingRequest,
  getBookingRequests,
  getRentersRequests,
};
