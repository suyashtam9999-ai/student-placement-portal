const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");
const Resource = require("./Resource");

// Join table: which student has completed which resource
const CompletedResource = sequelize.define(
  "CompletedResource",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  },
  { timestamps: true }
);

User.belongsToMany(Resource, { through: CompletedResource, foreignKey: "userId", otherKey: "resourceId" });
Resource.belongsToMany(User, { through: CompletedResource, foreignKey: "resourceId", otherKey: "userId" });

module.exports = CompletedResource;
