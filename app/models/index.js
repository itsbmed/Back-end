"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../../config/settings.js")["db"];
const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );
}

const models = {};
models.Agent = require("./agentModel")(sequelize, Sequelize.DataTypes);
models.Patient = require("./patientModel")(sequelize, Sequelize.DataTypes);
models.Episode = require("./episodeModel")(sequelize, Sequelize.DataTypes);
models.Bill = require("./billModel")(sequelize, Sequelize.DataTypes);

models.Episode.belongsTo(models.Patient, {
    foreignKey: "patientId",
    as: "patient",
});

Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = {
    db,
    ...models,
};
