const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Question = sequelize.define(
  "Question",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    category: {
      type: DataTypes.ENUM("Aptitude", "Coding", "Core CS", "HR", "Communication"),
      allowNull: false,
    },
    questionText: { type: DataTypes.TEXT, allowNull: false },
    // Stored as JSON text: ["opt1","opt2","opt3","opt4"]
    options: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const raw = this.getDataValue("options");
        return raw ? JSON.parse(raw) : [];
      },
      set(value) {
        this.setDataValue("options", JSON.stringify(value));
      },
    },
    correctOptionIndex: { type: DataTypes.INTEGER, allowNull: false },
  },
  { timestamps: false }
);

module.exports = Question;
