const { users, preferenceTable, roomTable } = require("../../model");
const { CustomVectorizer } = require("../../utils/tfIdfVectorizer");

//   app.post("/save-preference", (req, res) => {
//     const { user_id, preference_text } = req.body;
//     const query = `
//       INSERT INTO user_preferences (user_id, preference_text)
//       VALUES (?, ?) ON DUPLICATE KEY UPDATE preference_text = ?`;
//     db.query(query, [user_id, preference_text, preference_text], (err, result) => {
//       if (err) res.status(500).json({ error: "Database error" });
//       else res.json({ message: "Preference saved successfully" });
//     });
//   });

const recommendRooms = async (req, res) => {
  const user = req.user;
  console.log("user", user);
  console.log("req.body", req.body);
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
  console.log("userVector", userVector);

  const roomVectors = allRooms.map((room) =>
    vectorizer.transform(
      room.description,
      min_price,
      max_price,
      room.price,
      room
    )
  );

  console.log("room vectors", roomVectors);

  const scores = allRooms.map((room, index) => ({
    room_id: room.r_id,
    score: vectorizer.cosineSimilarity(userVector, roomVectors[index]),
    room_details: room,
  }));

  scores.sort((a, b) => b.score - a.score);
  return res.status(200).json(scores.slice(0, 3));

  //   return res.status(200).json({
  //     message: "User preference found",
  //     data: userPreference,
  //   });
};

module.exports = { recommendRooms };

// **API to Get Recommended Rooms**
//   app.post("/recommend-rooms", (req, res) => {
//     const { user_id } = req.body;

//     // Fetch user preference
//     db.query(
//       "SELECT preference_text FROM user_preferences WHERE user_id = ?",
//       [user_id],
//       (err, userResult) => {
//         if (err || userResult.length === 0) {
//           return res.status(404).json({ error: "User preference not found" });
//         }

//         const user_preference = userResult[0].preference_text;

//         // Fetch room descriptions
//         db.query("SELECT id, description FROM rooms", (err, roomResults) => {
//           if (err || roomResults.length === 0) {
//             return res.status(500).json({ error: "No rooms available" });
//           }

//           const descriptions = roomResults.map((room) => room.description);
//           const vectorizer = new TFIDFVectorizer();
//           vectorizer.fit([user_preference, ...descriptions]);

//           // Transform user preference and room descriptions into vectors
//           const userVector = vectorizer.transform(user_preference);
//           const roomVectors = descriptions.map((desc) => vectorizer.transform(desc));

//           // Compute similarities
//           const scores = roomResults.map((room, index) => ({
//             room_id: room.id,
//             score: vectorizer.cosineSimilarity(userVector, roomVectors[index]),
//           }));

//           // Sort and return top 3 matches
//           scores.sort((a, b) => b.score - a.score);
//           res.json(scores.slice(0, 3));
//         });
//       }
//     );
//   });
