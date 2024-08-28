const bcrypt = require("bcrypt");
const { users } = require("../model/index");

const signUpUser = async (req, res) => {
  const { full_name, email, dob, phone, password, address, location, role } =
    req.body;

  const existingUser = await users.findOne({
    where: {
      email,
    },
  });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  try {
    const hashedPW = await bcrypt.hash(password, 5);

    const user = await users.create({
      full_name,
      email,
      dob,
      phone,
      password: hashedPW,
      address,
      location,
      role,
    });

    if (user) {
      return res.status(200).json({
        message: "User created successfully",
        data: user,
      });
    } else {
      return res.status(400).json({
        message: "User creation failed",
      });
    }
  } catch (error) {
    console.log("user creation error", error);
    return res.status(500).json({
      message: "Internal server error",
      errorData: error,
    });
  }
};

module.exports = { signUpUser };
