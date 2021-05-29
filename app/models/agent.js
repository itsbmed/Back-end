"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Agent extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
        checkPassword(password) {
            return this.password === password;
        }
    }
    Agent.init(
        {
            nom: DataTypes.STRING,
            prenom: DataTypes.STRING,
            username: DataTypes.STRING,
            password: DataTypes.STRING,
        },
        {
            sequelize,
            timestamps: false,
            modelName: "Agent",
        }
    );
    return Agent;
};
