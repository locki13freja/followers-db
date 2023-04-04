const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("test", "", "", {
  host: "localhost:5432",
  dialect: "postgres",
});

module.exports = () => {
  const Users = sequelize.define("Users", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
    },
    instagramSubscribers: {
      type: DataTypes.STRING,
    },
    twitterSubscribers: {
      type: DataTypes.STRING,
    },
    facebookSubscribers: {
      type: DataTypes.STRING,
    },
  });

  return Users;
};
