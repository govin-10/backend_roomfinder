"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("userPreferences", "min_price", {
      type: Sequelize.INTEGER,
      allowNull: false,
    }),
      await queryInterface.addColumn("userPreferences", "max_price", {
        type: Sequelize.INTEGER,
        allowNull: false,
      });
    await queryInterface.addColumn("userPreferences", "wifi", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
    await queryInterface.addColumn("userPreferences", "parking", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
    await queryInterface.addColumn("userPreferences", "electricity", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
    await queryInterface.addColumn("userPreferences", "water", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
    await queryInterface.addColumn("userPreferences", "disposal_charge", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
