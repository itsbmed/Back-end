"use strict";
const { Model, Deferrable } = require("sequelize");
const { Patient } = require("./index");
module.exports = (sequelize, DataTypes) => {
    class Episode extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Episode.init(
        {
            patientId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Patients",
                    key: "ipp",
                },
            },
            type: DataTypes.ENUM("external", "hospitalized"),
            category: DataTypes.STRING,
            initDate: DataTypes.DATE,
            entryDate: DataTypes.DATE,
            exitDate: DataTypes.DATE,
            presentationNature: DataTypes.ENUM("CS/SP", "RX"),
            service: DataTypes.STRING,
            situation: DataTypes.STRING,
            tnErcure: DataTypes.STRING,
            admType: DataTypes.ENUM("urgent", "normal"),
            tName: DataTypes.STRING,
        },
        {
            sequelize,
            timestamps: false,
            modelName: "Episode",
        }
    );
    return Episode;
};