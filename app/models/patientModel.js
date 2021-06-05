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
            },
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            nCode: DataTypes.STRING(255),
            nDate: DataTypes.STRING,
        },
        {
            sequelize,
            timestamps: false,
            modelName: "Patient",
        }
    );
    return Patient;
};
