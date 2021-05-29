"use strict";
const path = require("path");
// include dotenv variables
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// initialize common config
const commonConfig = {
    corsOptions: {
        origin: "*", // TODO : change it in production !
    },
    app: {
        port: parseInt(process.env.PORT) || 5000,
        debug: process.env.DEBUGGER.toLowerCase() === "true" ? true : false,
        logger_format: process.env.LOGGER_FORMAT || "combined",
    },
    db: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
    },
    jwtSecrets: {
        accessTokenSecretKey:
            process.env.ACCESS_TOKEN_SECRET_KEY || "a-hard-guessed-secret-key",
    },
};

// initialize development config
const devConfig = { ...commonConfig, name: "development" };

// initialize testing config
const testConfig = { ...commonConfig, name: "testing" };

// initialize production config
const proConfig = {
    ...commonConfig,
    name: "production",
};
proConfig.app.port = parseInt(process.env.PORT) || 8080;

// arrange for exporting
const config = new Map();
config.set(devConfig.name, devConfig);
config.set(proConfig.name, proConfig);
config.set(testConfig.name, testConfig);

// set env fallback
const fallback = "production";

const env = process.env.NODE_ENV;

module.exports = config.has(env.toLowerCase())
    ? config.get(env)
    : config.get(fallback);
