const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("student", "admin"), defaultValue: "student" },

    branch: { type: DataTypes.STRING, defaultValue: "" },
    graduationYear: { type: DataTypes.INTEGER, allowNull: true },
    phone: { type: DataTypes.STRING, defaultValue: "" },
    // Stored as comma-separated text for simplicity in MySQL
    skills: { type: DataTypes.TEXT, defaultValue: "" },
    resumeLink: { type: DataTypes.STRING, defaultValue: "" },
    githubLink: { type: DataTypes.STRING, defaultValue: "" },
    linkedinLink: { type: DataTypes.STRING, defaultValue: "" },
    targetCompanies: { type: DataTypes.TEXT, defaultValue: "" },
  },
  {
    timestamps: true,
    hooks: {
      beforeSave: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

User.prototype.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Helpers to convert comma-separated text fields <-> arrays for the API layer
User.prototype.toSafeJSON = function () {
  const { password, ...rest } = this.toJSON();
  return {
    ...rest,
    skills: rest.skills ? rest.skills.split(",").filter(Boolean) : [],
    targetCompanies: rest.targetCompanies ? rest.targetCompanies.split(",").filter(Boolean) : [],
  };
};

module.exports = User;
