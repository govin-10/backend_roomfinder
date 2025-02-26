const cloudinary = require("../config/cloudinaryConfig");

const uploadImages = async (req, res, next) => {
  console.log("req.files", req.files);

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "No files uploaded",
      });
    }

    const files = req.files.map((file) => file.path);
    const uploadedRoomImages = [];
    for (const file of files) {
      const uploadImageUrl = await cloudinary.uploader.upload(file, {
        folder: "room_images",
      });
      uploadedRoomImages.push(uploadImageUrl.secure_url);
    }
    req.body.room_image_url = uploadedRoomImages;
    next();
  } catch (error) {
    console.log("Error in uploading room images", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = uploadImages;
