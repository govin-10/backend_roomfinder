const { users, preferenceTable, roomTable } = require("../../model");
const { CustomVectorizer } = require("../../utils/tfIdfVectorizer");

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

  const allRooms = await roomTable.findAll({
    where: {
      admin_approval: true,
    },
  });

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

  const recommendedRooms = allRooms.map((room) => {
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

  const finalRooms = recommendedRooms
    .slice(0, 5)
    .sort((a, b) => b.score - a.score);

  return res.status(200).json(finalRooms);
};

module.exports = { recommendRooms, savePreference, getPreference };
