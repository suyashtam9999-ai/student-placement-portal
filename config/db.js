const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`MySQL connected: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

    // Auto create/update tables based on models (fine for a college project)
    await sequelize.sync({ alter: true });
    console.log("Database tables synced");
  } catch (error) {
    console.error(`MySQL connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
