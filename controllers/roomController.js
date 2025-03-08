const { users, roomTable } = require("../model/index");

const cloudinary = require("../config/cloudinaryConfig");
const { Op } = require("sequelize");

const uploadRoomImages = async (req, res) => {
  const files = req.body.files;

  try {
    const uploadedRoomImages = [];

    for (const file of files) {
      const uploadImageUrl = await cloudinary.uploader.upload(file, {
        folder: "room_images",
      });
      console.log("uploadImageUrl", uploadImageUrl);
      uploadedRoomImages.push(uploadImageUrl.secure_url);
    }

    return res.status(200).json({
      message: "Room images uploaded successfully",
      data: uploadedRoomImages,
    });
  } catch (error) {
    console.log("Error in uploading room images", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const createRoom = async (req, res) => {
  const user = req.user;
  const u_id = user.id;

  const {
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

  const splittedLocation = location.split(",");

  const updatedLocation = {
    type: "Point",
    coordinates: [Number(splittedLocation[0]), Number(splittedLocation[1])],
  };

  // console.log("location", updatedLocation);
  // return;

  try {
    const newRoom = await roomTable.create({
      u_id,
      title,
      description,
      price,
      location: updatedLocation,
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
    const allRooms = await roomTable.findAll({
      where: {
        admin_approval: true,
      },
    });

    const availableRooms = allRooms.filter((room) => {
      return room.room_status === "available";
    });

    console.log("alrooms", availableRooms);

    if (availableRooms.length > 0) {
      return res.status(200).json({
        message: "All Rooms fetched successfully",
        data: availableRooms,
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
