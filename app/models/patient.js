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
            ipp: DataTypes.INTEGER,
            nom: DataTypes.STRING,
            prenom: DataTypes.STRING,
            n_code: DataTypes.INTEGER,
            n_date: DataTypes.DATE,
        },
        {
            sequelize,
            timestamps: false,
            modelName: "Patient",
        }
    );
    return Patient;
};
