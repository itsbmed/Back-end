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
                onDelete: "cascade",
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
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            cin: DataTypes.STRING,
            address: DataTypes.STRING(255),
            type: DataTypes.ENUM("EXTERNAL", "HOSPITALIZED"),
            admType: DataTypes.ENUM("URGENT", "NORMAL"),
            entryDate: DataTypes.DATE,
            exitDate: DataTypes.DATE,
            category: DataTypes.ENUM(
                "PAID",
                "POTENTIAL",
                "RAMED",
                "CNOPS",
                "MAFAR",
                "CNSS",
                "PERSONNEL",
                "ORGANISM"
            ),
            presentationNature: DataTypes.ENUM("LAB", "RADIO", "CONSULTATION"),
            service: DataTypes.ENUM(
                "P1",
                "P2",
                "P3",
                "P4",
                "P5",
                "CHA",
                "CHB",
                "CHC", 
                "CHOP",
                "UPM",
                "UPC",
                "REAA",
                "REAB"
            ),
            ramedExpDate: DataTypes.DATE,
            ramedNum: DataTypes.INTEGER,
            hospitalDay: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: "Episode",
        }
    );
    return Episode;
};
