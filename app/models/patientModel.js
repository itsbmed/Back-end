"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Patient extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Patient.init(
        {
            ipp: {
                type: DataTypes.INTEGER(255),
                primaryKey: true,
                autoIncrement: true,
                unique: true,
            },
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Patient",
        }
    );
    return Patient;
};
