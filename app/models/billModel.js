"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Bill extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here\
            models.Bill.belongsTo(models.Episode, {
                onDelete: "cascade",
                foreignKey: "episodeId",
                as: "episode",
            });
            models.Episode.hasOne(models.Bill, {
                onDelete: "cascade",
                foreignKey: "episodeId",
                as: "bill",
            });
        }
        async updateBill(newData) {
            for (let data in newData) {
                this[data] = newData[data];
            }
        }
    }
    Bill.init(
        {
            episodeId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Episodes",
                    key: "id",
                },
            },
            organismPart: DataTypes.INTEGER,
            adherentPart: DataTypes.INTEGER,
            billNum: DataTypes.INTEGER,
            billDate: DataTypes.DATE,
            medicalBiology: DataTypes.INTEGER,
            medicalImaging: DataTypes.INTEGER,
            prosthesis: DataTypes.INTEGER,
            InvoicedStay: DataTypes.INTEGER,
            medicalFees: DataTypes.INTEGER,
            billedMedication: DataTypes.INTEGER,
            actes: DataTypes.INTEGER,
            total: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Bill",
        }
    );
    return Bill;
};
