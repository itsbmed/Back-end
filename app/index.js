"use strict";
const errorHandler = require("./middlewares/errorHandler");
const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const createAgentAdmin = require("./helpers/createAgentAdmin");

// sync sequelize to create models
const { db } = require("./models/index");
db.sequelize.sync().then(async () => {
    // create agent admin
    await createAgentAdmin({
        userName: process.env.ADMIN_USERNAME || "admin",
        passWord: process.env.ADMIN_PASSWORD || "admin",
        firstName: process.env.ADMIN_FIRSTNAME || "Admin",
        lastName: process.env.ADMIN_LASTNAME || "Admin",
        isAdmin: true,
    });
});
// inlcude routers
const agentRouter = require("./routes/agentRouter");
const patientRouter = require("./routes/patientRouter");
const episodeRouter = require("./routes/episodeRouter");
const billRouter = require("./routes/billRouter");
const analyticRouter = require("./routes/analyticRouter");
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
app.use(api_path, patientRouter);
app.use(api_path, episodeRouter);
app.use(api_path, billRouter);
app.use(api_path, analyticRouter);

// handle 404 error
app.use("*", async (req, res, next) => {
    res.sendFile(
        path.resolve(__dirname, "./public", req.originalUrl),
        (err) => {
            if (err) {
                res.sendFile(path.resolve(__dirname, "./public/index.html"));
            }
        }
    );
});

// error handler
app.use(errorHandler);

module.exports = app;
