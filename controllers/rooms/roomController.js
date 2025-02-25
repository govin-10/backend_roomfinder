const { users, roomTable } = require("../../model/index");

const createRoom = async (req, res) => {
  const user = req.user;
  const u_id = user.id;

  const {
    title,
    description,
    price,
    latitude,
    longitude,
    address,
    room_type,
    areaSize,
    no_of_room,
    room_status,
    room_image_url,
    wifi,
    parking,
    water,
    disposal_charge,
    electricity,
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
      latitude,
      longitude,
      address,
      room_type,
      areaSize,
      no_of_room,
      room_status,
      room_image_url,
      wifi,
      parking,
      water,
      disposal_charge,
      electricity,
    });

    if (newRoom) {
      return res.status(200).json({
        message: "New Room created successfully",
        statusCode: 200,
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
      return plainRoom;
    });

    const approvedRooms = parsedRooms.filter(
      (room) => room.admin_approval == true
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

const getRoomById = async (req, res) => {
  const { r_id } = req.params;

  try {
    const room = await roomTable.findOne({
      where: {
        r_id,
      },
    });

    if (room) {
      return res.status(200).json({
        message: "Room fetched successfully",
        data: room,
      });
    } else {
      return res.status(400).json({
        message: "Room not found",
      });
    }
  } catch (error) {
    console.log("Error in fetching room by id", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createRoom,
  getRooms,
  getRoomById,
};
