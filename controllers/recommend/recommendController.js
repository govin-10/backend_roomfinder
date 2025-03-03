const { users, preferenceTable, roomTable } = require("../../model");
const { CustomVectorizer } = require("../../utils/tfIdfVectorizer");
const { haversineDistance } = require("../rooms/searchRoom");

const savePreference = async (req, res) => {
  const user = req.user;
  const u_id = user.id;

  const {
    preference_text,
    min_price,
    max_price,
    wifi,
    electricity,
    parking,
    water,
    disposal_charge,
  } = req.body;

  const existingUser = await users.findOne({
    where: {
      u_id,
    },
  });

  if (!existingUser) {
    return res.status(400).json({
      message: "User does not exist, Unable to save preference",
    });
  }

  const existingPreference = await preferenceTable.findOne({
    where: {
      u_id,
    },
  });

  if (existingPreference) {
    const updatedPreference = await existingPreference.update({
      up_preference: preference_text,
      min_price,
      max_price,
      wifi,
      electricity,
      parking,
      water,
      disposal_charge,
    });

    if (updatedPreference) {
      return res.status(200).json({
        message: "Preference updated successfully",
      });
    }
  }

  const newPreference = await preferenceTable.create({
    u_id,
    up_preference: preference_text,
    min_price,
    max_price,
    wifi,
    electricity,
    parking,
    water,
    disposal_charge,
  });

  if (newPreference) {
    return res.status(200).json({
      message: "Preference saved successfully",
    });
  }

  return res.status(500).json({
    message: "Unable to save preference",
  });
};

const getPreference = async (req, res) => {
  const user = req.user;
  const existingUser = await users.findOne({
    where: {
      u_id: user.id,
    },
  });

  if (!existingUser) {
    return res.status(400).json({
      message: "User does not exist, Unable to create room",
    });
  }

  const userPreference = await preferenceTable.findOne({
    where: {
      u_id: user.id,
    },
  });

  if (!userPreference) {
    return res.status(400).json({
      message: "User preference not found",
    });
  }

  return res.status(200).json({
    message: "User preference found",
    data: userPreference,
  });
};

const recommendRooms = async (req, res) => {
  const user = req.user;
  const existingUser = await users.findOne({
    where: { u_id: user.id },
  });

  if (!existingUser) {
    return res
      .status(400)
      .json({ message: "User does not exist, Unable to create room" });
  }

  const userPreference = await preferenceTable.findOne({
    where: { u_id: user.id },
  });

  if (!userPreference) {
    return res.status(400).json({ message: "User preference not found" });
  }

  const {
    preference_text,
    min_price,
    max_price,
    wifi,
    electricity,
    parking,
    water,
    disposal_charge,
  } = userPreference;

  const allRooms = await roomTable.findAll();

  const vectorizer = new CustomVectorizer();
  vectorizer.fit([
    userPreference.up_preference,
    ...allRooms.map((room) => room.description),
  ]);

  const userVector = vectorizer.transform(
    preference_text,
    min_price,
    max_price,
    0,
    { wifi, electricity, parking, water, disposal_charge }
  );

  const roomScores = allRooms.map((room) => {
    const roomVector = vectorizer.transform(
      room.description,
      min_price,
      max_price,
      room.price,
      room
    );
    return {
      room_id: room.r_id,
      score: vectorizer.cosineSimilarity(userVector, roomVector),
      room_details: room,
    };
  });

  // Step 1: Filter rooms with similarity score ≥ 0.5
  const threshold = 0.5;
  let highSimilarityRooms = roomScores.filter(
    (room) => room.score >= threshold
  );
  highSimilarityRooms.sort((a, b) => b.score - a.score); // Sort by similarity score

  // Step 2: Get nearby rooms (2km radius)
  const userLocation = existingUser.location.coordinates;
  const radius = 2; // 2km radius

  let nearbyRooms = roomScores.filter((room) => {
    const { latitude, longitude } = room.room_details;
    return (
      haversineDistance(
        userLocation[0],
        userLocation[1],
        latitude,
        longitude
      ) <= radius
    );
  });

  nearbyRooms.sort((a, b) => b.score - a.score); // Sort nearby rooms by similarity score

  // Step 3: Ensure we return exactly 5 rooms
  let finalRooms = [];

  if (highSimilarityRooms.length >= 5) {
    // If there are 5 or more high similarity rooms, return the top 5
    finalRooms = highSimilarityRooms.slice(0, 5);
  } else {
    // Otherwise, take all high similarity rooms and fill the rest with nearby rooms
    finalRooms = [...highSimilarityRooms];

    // Add nearby rooms until we have 5 recommendations
    for (let room of nearbyRooms) {
      if (finalRooms.length >= 5) break;
      if (!finalRooms.some((r) => r.room_id === room.room_id)) {
        finalRooms.push(room);
      }
    }
  }

  return res.status(200).json(finalRooms);
};

module.exports = { recommendRooms, savePreference, getPreference };
