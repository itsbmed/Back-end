"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Episode extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.Episode.belongsTo(models.Patient, {
                foreignKey: "patientId",
                as: "patient",
            });
        }
        async updateEpisode(newData) {
            for (let data in newData) {
                this[data] = newData[data];
            }
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
            service: DataTypes.ENUM(
                "P1",
                "P2",
                "P3",
                "P4",
                "CH-A",
                "CH-B",
                "CH-C",
                "CH-D"
            ),
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
