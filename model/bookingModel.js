module.exports = (sequelize, DataTypes) => {
  const Bookings = sequelize.define("bookings", {
    b_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    u_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "u_id",
      },
      onDelete: "CASCADE",
    },
    r_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "rooms",
        key: "r_id",
      },
      onDelete: "CASCADE",
    },
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    booking_status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "pending",
      validate: {
        isIn: {
          args: [["pending", "approved", "rejected"]],
          msg: "Booking status must be either 'pending', 'approved' or 'rejected'",
        },
      },
    },
  });

  Bookings.associate = (models) => {
    Bookings.belongsTo(models.users, {
      foreignKey: "u_id",
    });
    Bookings.belongsTo(models.rooms, {
      foreignKey: "r_id",
    });
  };

  return Bookings;
};
