"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
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
       async  hashPassword() {
            try {
                let salt = await bcrypt.genSalt(10);
                let hashedPassword = await bcrypt.hash(this.passWord, salt);
                this.passWord = hashedPassword;
            } catch (err) {
                throw err;
            }
        }
        async checkPassword(passWord) {
            try {
                return await bcrypt.compare(passWord, this.passWord);
            } catch (err) {
                throw err;
            }
        }
    }
    Agent.init(
        {
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            userName: DataTypes.STRING,
            passWord: DataTypes.STRING,
            isAdmin: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            timestamps: false,
            modelName: "Agent",
        }
    );
    return Agent;
};
