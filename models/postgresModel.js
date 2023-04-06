const {Sequelize, DataTypes} = require("sequelize");
const sequelize = new Sequelize("test", "postgres", "mafia", {
    host: "localhost",
    dialect: "postgres",
});
sequelize.authenticate().then(() => {
    console.log('connect');
}).catch((error) => {
    console.log(error);
});

module.exports = () => {
    const Users = sequelize.define("users", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
        },
        instagramSubscribers: {
            type: DataTypes.NUMBER,
        },
        twitterSubscribers: {
            type: DataTypes.NUMBER,
        },
        facebookSubscribers: {
            type: DataTypes.NUMBER,
        },
    }, {
        freezeTableName: true
    });
    return Users;
};
