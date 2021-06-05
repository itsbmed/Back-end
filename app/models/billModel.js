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
            // define association here
        }
    }
    Bill.init(
        {
            nReceipt: DataTypes.INTEGER,
            nBill: DataTypes.INTEGER,
            nature: DataTypes.STRING,
            episodeId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Episodes",
                    key: "id",
                },
            },
            medicament: DataTypes.INTEGER,
            actes: DataTypes.INTEGER,
            total: DataTypes.INTEGER,
            category: DataTypes.ENUM("PAYANT", "RAMED"),
            prosthesis: DataTypes.INTEGER,
        },
        {
            sequelize,
            timestamps: false,
            modelName: "Bill",
        }
    );
    return Bill;
};
