const { users, roomTable } = require("../../model");

const roomKpis = async (req, res) => {
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
    const AllRooms = await roomTable.count();
    const totalApprovedRooms = await roomTable.count({
      where: {
        admin_approval: true,
      },
    });
    const totalPendingRooms = await roomTable.count({
      where: {
        admin_approval: false,
      },
    });

    const totalFlats = await roomTable.count({
      where: {
        room_type: "flat",
      },
    });

    const totalRooms = await roomTable.count({
      where: {
        room_type: "room",
      },
    });

    return res.status(200).json({
      AllRooms,
      totalFlats,
      totalRooms,
      totalApprovedRooms,
      totalPendingRooms,
    });
  } catch (error) {
    console.log("Error in fetching rooms", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getAllRooms = async (req, res) => {
  const user = req.user;
  const { u_id } = user;
  const existingUser = await users.findOne({
    where: {
      u_id,
    },
  });

  if (!existingUser.role !== "admin") {
    return res.status(403).json({
      message: "You are not authorized to view all rooms",
    });
  }

  try {
    const allRooms = await roomTable.findAll();

    const parsedRooms = allRooms.map((room) => {
      const plainRoom = room.get({ plain: true });
      return plainRoom;
    });

    if (allRooms) {
      return res.status(200).json({
        message: "All Rooms fetched successfully",
        data: parsedRooms,
      });
    } else {
      return res.status(400).json({
        message: "No rooms found",
      });
    }
  } catch (error) {
    console.log("Error in fetching rooms", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getPendingRooms = async (req, res) => {
  const user = req.user;
  const { u_id } = user;
  const existingUser = await users.findOne({
    where: {
      u_id,
    },
  });

  if (!existingUser.role !== "admin") {
    return res.status(403).json({
      message: "You are not authorized to view all rooms",
    });
  }

  try {
    const allRooms = await roomTable.findAll();

    const parsedRooms = allRooms.map((room) => {
      const plainRoom = room.get({ plain: true });
      return plainRoom;
    });

    const approvedRooms = parsedRooms.filter(
      (room) => room.admin_approval == false
    );

    if (allRooms) {
      return res.status(200).json({
        message: "All Rooms fetched successfully",
        data: approvedRooms,
      });
    } else {
      return res.status(400).json({
        message: "No rooms found",
      });
    }
  } catch (error) {
    console.log("Error in fetching rooms", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const approveRoom = async (req, res) => {
  const user = req.user;
  const { u_id } = user;
  const existingUser = await users.findOne({
    where: {
      u_id,
    },
  });

  if (!existingUser.role !== "admin") {
    return res.status(403).json({
      message: "You are not authorized to view all rooms",
    });
  }

  const { room_id } = req.params;

  try {
    const room = await roomTable.findOne({
      where: {
        room_id: room_id,
      },
    });

    if (room) {
      const updatedRoom = await room.update({
        admin_approval: true,
      });

      return res.status(200).json({
        message: "Room approved successfully",
        data: updatedRoom,
      });
    } else {
      return res.status(400).json({
        message: "Room not found",
      });
    }
  } catch (error) {
    console.log("Error in approving room", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const rejectRoom = async (req, res) => {
  const user = req.user;
  const { u_id } = user;
  const existingUser = await users.findOne({
    where: {
      u_id,
    },
  });

  if (!existingUser.role !== "admin") {
    return res.status(403).json({
      message: "You are not authorized to view all rooms",
    });
  }
  const { room_id } = req.params;

  try {
    const room = await roomTable.findOne({
      where: {
        room_id: room_id,
      },
    });

    if (room) {
      await room.destroy();

      return res.status(200).json({
        message: "Room rejected successfully",
        data: updatedRoom,
      });
    } else {
      return res.status(400).json({
        message: "Room not found",
      });
    }
  } catch (error) {
    console.log("Error in rejecting room", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const deleteRoom = async (req, res) => {
  const user = req.user;
  const { r_id } = req.params;

  const existingUser = await users.findOne({
    where: {
      u_id: user.id,
    },
  });

  if (!existingUser.role !== "homeowner") {
    return res.status(403).json({
      message: "You are not authorized to delete this room",
    });
  }

  try {
    const room = await roomTable.findOne({
      where: {
        r_id: r_id,
      },
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    await room.destroy();
    return res.status(200).json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    return res.status(500).json({
      message: "Internal server error",
      errorData: error,
    });
  }
};

const getFlats = async (req, res) => {
  const user = req.user;
  const { u_id } = user;
  const existingUser = await users.findOne({
    where: {
      u_id,
    },
  });

  if (!existingUser.role !== "admin") {
    return res.status(403).json({
      message: "You are not authorized to view all rooms",
    });
  }

  try {
    const allFlats = await roomTable.findAll({
      where: {
        room_type: "flat",
      },
    });

    // const parsedRooms = allRooms.map((room) => {
    //   const plainRoom = room.get({ plain: true });
    //   return plainRoom;
    // });

    // const approvedRooms = parsedRooms.filter(
    //   (room) => room.admin_approval == true
    // );

    if (allFlats) {
      return res.status(200).json({
        message: "All Flats fetched successfully",
        data: allFlats,
      });
    } else {
      return res.status(400).json({
        message: "No Flats found",
      });
    }
  } catch (error) {
    console.log("Error in fetching rooms", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getRooms = async (req, res) => {
  const user = req.user;
  const { u_id } = user;
  const existingUser = await users.findOne({
    where: {
      u_id,
    },
  });

  if (!existingUser.role !== "admin") {
    return res.status(403).json({
      message: "You are not authorized to view all rooms",
    });
  }

  try {
    const allRooms = await roomTable.findAll();

    if (allRooms) {
      return res.status(200).json({
        message: "All Rooms fetched successfully",
        data: allRooms,
      });
    } else {
      return res.status(400).json({
        message: "No rooms found",
      });
    }
  } catch (error) {
    console.log("Error in fetching rooms", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  roomKpis,
  getAllRooms,
  getPendingRooms,
  approveRoom,
  rejectRoom,
  deleteRoom,
  getFlats,
  getRooms,
};
