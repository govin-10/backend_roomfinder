const { Op } = require("sequelize");
const { roomTable, users } = require("../../model/index");

const searchRooms = async (req, res) => {
  try {
    const { query } = req.params;

    const allRooms = await roomTable.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            description: {
              [Op.like]: `%${query}%`,
            },
          },
        ],
      },
      limit: 15,
      offset: 0,
    });

    const searchResults = allRooms.map((room) => {
      return {
        r_id: room.r_id,
        title: room.title,
        price: room.price,
        latitude: room.latitude,
        longitude: room.longitude,
        address: room.address,
        room_type: room.room_type,
        room_image: room.room_image_url[0],
      };
    });

    res.status(200).json({ searchResults });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const toRad = (angle) => (angle * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Filter rooms within a given radius (in km)
const filterRoomsByRadius = (rooms, userLat, userLon, radius) => {
  return rooms.filter((room) => {
    const distance = haversineDistance(
      userLat,
      userLon,
      room.latitude,
      room.longitude
    );
    return distance <= radius; // Only keep rooms within the given radius
  });
};

const nearbyRooms = async (req, res) => {
  const user = req.user;
  const u_id = user.id;

  const userDetails = await users.findOne({
    where: { u_id },
  });
  const { coordinates } = userDetails.location;
  const latitude = coordinates[0];
  const longitude = coordinates[1];
  const { radius } = req.params;

  // Using the Haversine formula to calculate the distance between two points
  const allRooms = await roomTable.findAll({
    attributes: [
      "r_id",
      "title",
      "price",
      "latitude",
      "longitude",
      "address",
      "room_type",
      "room_image_url",
    ],
  });

  const filteredRooms = filterRoomsByRadius(
    allRooms,
    latitude,
    longitude,
    radius
  );
  if (filteredRooms.length === 0) {
    return res
      .status(404)
      .json({ message: "No rooms found within the given radius" });
  }
  return res.status(200).json({ rooms: filteredRooms });
};

module.exports = { searchRooms, nearbyRooms, haversineDistance };
