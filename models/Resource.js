const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Resource = sequelize.define(
  "Resource",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, defaultValue: "" },
    category: {
      type: DataTypes.ENUM("Aptitude", "Coding", "Core CS", "HR", "Communication"),
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.ENUM("Beginner", "Intermediate", "Advanced"),
      defaultValue: "Beginner",
    },
    link: { type: DataTypes.STRING, defaultValue: "" },
  },
  { timestamps: true }
);

module.exports = Resource;
