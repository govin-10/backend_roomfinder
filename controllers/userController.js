const bcrypt = require("bcrypt");
const { users } = require("../model/index");

const generateToken = require("../utils/generateJWT");
const calculateAge = require("../utils/ageCalculator");

const signUpUser = async (req, res) => {
  const {
    full_name,
    email,
    dob,
    gender,
    phone,
    password,
    address,
    location,
    role,
  } = req.body;

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
    const age = calculateAge(dob);

    const user = await users.create({
      full_name,
      dob,
      age,
      email,
      gender,
      phone,
      password: hashedPW,
      address,
      location,
      role,
    });

    if (user) {
      const userWithoutPassword = user.toJSON();
      delete userWithoutPassword.password;
      return res.status(200).json({
        message: "User created successfully",
        data: userWithoutPassword,
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

const loginUser = async (req, res) => {
  const { phone, password } = req.body;

  const IsExistingUser = await users.findOne({
    where: {
      phone,
    },
  });

  if (!IsExistingUser) {
    return res.status(400).json({
      message: "user doesn't exist in the system. Please signup ",
    });
  }

  const correctPassword = await bcrypt.compare(
    password,
    IsExistingUser.password
  );

  if (!correctPassword) {
    return res.status(400).json({
      message: "Invalid credentials. Please try again",
    });
  }

  const payload = {
    id: IsExistingUser.id,
    email: IsExistingUser.email,
    phone: IsExistingUser.phone,
  };

  const { accessToken, refreshToken } = generateToken(payload);

  if (accessToken && refreshToken) {
    const user = {
      id: IsExistingUser.id,
      full_name: IsExistingUser.full_name,
      dob: new Date(IsExistingUser.dob).toDateString(),
      email: IsExistingUser.email,
      emailVerified: IsExistingUser.emailVerified,
      phone: IsExistingUser.phone,
      address: IsExistingUser.address,
      location: {
        latitude: IsExistingUser.location.coordinates[0],
        longitude: IsExistingUser.location.coordinates[1],
      },
      role: IsExistingUser.role,
    };
    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user,
    });
  }
};

module.exports = { signUpUser, loginUser };
