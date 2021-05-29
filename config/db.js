require("dotenv").config();
const env = process.env.NODE_ENV;
const config = require("./settings")(env)["db"];
module.exports = config;
