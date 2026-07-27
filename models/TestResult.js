const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");

const TestResult = sequelize.define(
  "TestResult",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    category: { type: DataTypes.STRING, allowNull: false },
    totalQuestions: { type: DataTypes.INTEGER, allowNull: false },
    correctAnswers: { type: DataTypes.INTEGER, allowNull: false },
    scorePercent: { type: DataTypes.INTEGER, allowNull: false },
    timeTakenSeconds: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { timestamps: true }
);

TestResult.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(TestResult, { foreignKey: "userId" });

module.exports = TestResult;
