const { users, roomTable } = require("../model/index");

const createRoom = async (req, res) => {
  const {
    u_id,
    title,
    description,
    price,
    location,
    address,
    areaSize,
    availableFrom,
    room_status,
    room_image_url,
    facilities,
  } = req.body;

  const existingUser = await users.findOne({
    where: {
      u_id,
    },
  });

  if (!existingUser) {
    return res.status(400).json({
      message: "User does not exist, Unable to create room",
    });
  }

  try {
    const newRoom = await roomTable.create({
      u_id,
      title,
      description,
      price,
      location,
      address,
      areaSize,
      availableFrom,
      room_status,
      room_image_url,
      facilities,
    });

    if (newRoom) {
      return res.status(200).json({
        message: "New Room created successfully",
        data: newRoom,
      });
    } else {
      return res.status(400).json({
        message: "Room creation failed",
      });
    }
  } catch (error) {
    console.log("Room creation error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getRooms = async (req, res) => {
  try {
    const allRooms = await roomTable.findAll();

    const parsedRooms = allRooms.map((room) => {
      const plainRoom = room.get({ plain: true });
      return {
        ...plainRoom,
        location: plainRoom.location.coordinates,
        facilities: JSON.parse(plainRoom.facilities),
      };
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

module.exports = {
  createRoom,
  getRooms,
};
