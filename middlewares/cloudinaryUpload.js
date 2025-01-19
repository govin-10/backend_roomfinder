const cloudinary = require("../config/cloudinaryConfig");

const uploadImages = async (req, res, next) => {
  try {
    const files = req.files.map((file) => file.path);
    const uploadedRoomImages = [];
    for (const file of files) {
      console.log("file", file);
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
