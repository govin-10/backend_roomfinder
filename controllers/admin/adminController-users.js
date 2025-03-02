const { Op } = require("sequelize");
const { users } = require("../../model");

const userKpis = async (req, res) => {
  const user = req.user;
  const { r_id } = req.params;

  const existingUser = await users.findOne({
    where: {
      u_id: user.id,
    },
  });

  console.log("existinUser", existingUser);

  if (!existingUser.role === "admin") {
    return res.status(403).json({
      message: "You are not authorized to view this stats",
    });
  }

  try {
    const totalUsers = await users.count({
      where: {
        role: { [Op.ne]: "admin" },
      },
    });
    const totalActiveUsers = await users.count({
      where: {
        status: "active",
        role: { [Op.ne]: "admin" },
      },
    });
    const totalInactiveUsers = await users.count({
      where: {
        status: "inactive",
      },
    });
    const totalHomeOwners = await users.count({
      where: {
        role: "homeOwner",
      },
    });
    const totalRenters = await users.count({
      where: {
        role: "renter",
      },
    });

    return res.status(200).json({
      totalUsers,
      totalActiveUsers,
      totalInactiveUsers,
      totalHomeOwners,
      totalRenters,
    });
  } catch (error) {
    console.log("Error in deleting room", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getAllUsers = async (req, res) => {
  const user = req.user;

  const existingUser = await users.findOne({
    where: {
      u_id: user.id,
    },
  });

  if (!existingUser.role === "admin") {
    return res.status(403).json({
      message: "You are not authorized to view this stats",
    });
  }

  try {
    const allUsers = await users.findAll({
      where: {
        role: { [Op.ne]: "admin" },
      },
    });

    if (allUsers) {
      return res.status(200).json({
        message: "All users fetched successfully",
        data: allUsers,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error in fetching data",
    });
  }
};

const blockUser = async (req, res) => {
  const user = req.user;
  const existingUser = await users.findOne({
    where: {
      u_id: user.id,
    },
  });

  if (!existingUser.role === "admin") {
    return res.status(403).json({
      message: "You are not authorized to view this stats",
    });
  }

  const { u_id } = req.params;

  try {
    const currentUser = await users.find({
      where: {
        u_id,
      },
    });
    await currentUser.update({
      status: "inactive",
    });

    return res.status(200).json({
      message: "user status updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in updating user status",
    });
  }
};

const getHomeOwners = async (req, res) => {
  const user = req.user;
  const { r_id } = req.params;

  const existingUser = await users.findOne({
    where: {
      u_id: user.id,
    },
  });

  if (!existingUser.role === "admin") {
    return res.status(403).json({
      message: "You are not authorized to view this stats",
    });
  }

  try {
    const allHomeOwners = await users.findAll({
      where: {
        role: "homeOwner",
      },
    });

    return res.status(200).json({
      message: "All homeOwners fetched successfully",
      data: allHomeOwners,
      totalHomeOwners: allHomeOwners.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in fetching data",
    });
  }
};

const getRenters = async (req, res) => {
  const user = req.user;
  const { r_id } = req.params;

  const existingUser = await users.findOne({
    where: {
      u_id: user.id,
    },
  });

  if (!existingUser.role === "admin") {
    return res.status(403).json({
      message: "You are not authorized to view this stats",
    });
  }

  try {
    const allRenters = await users.findAll({
      where: {
        role: "renter",
      },
    });

    return res.status(200).json({
      message: "All Renters fetched successfully",
      data: allRenters,
      totalRenters: allRenters.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in fetching data",
    });
  }
};

module.exports = {
  userKpis,
  getAllUsers,
  blockUser,
  getHomeOwners,
  getRenters,
};
