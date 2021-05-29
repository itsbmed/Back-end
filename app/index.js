"use strict";
const errorHandler = require("./middlewares/errorHandler");
const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

// sync sequelize to create models
const db = require("./models/index");
db.sequelize.sync();
// inlcude routers
const agentRouter = require("./routes/agentRouter");
const env = process.env.NODE_ENV;
const {
    name,
    corsOptions,
    app: { port, debug, logger_format },
} = require("../config/settings");

// create instance from express
const app = express();

// set express variables
app.set("port", port);
app.set("env", name);
app.set("debugger", debug);

// initialize middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    express.static(path.join(__dirname, "./public"), { dotfiles: "allow" })
);
if (debug) app.use(logger(logger_format));

const api_path = "/api/v1";
// initialeze routers
app.use(api_path, agentRouter);

// handle 404 error
app.use("*", (req, res, next) => {
    try {
        throw createError.NotFound(); // throw an error to the catch
    } catch (err) {
        next(err);
    }
});

// error handler
app.use(errorHandler);

module.exports = app;
