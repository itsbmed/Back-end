const { Agent } = require("../models");
const createError = require("http-errors");
const { verifyAccessToken } = require("../helpers/jwt");
module.exports = async (req, res, next) => {
    try {
        if (!req.headers.hasOwnProperty("x-auth-token"))
            throw createError.Unauthorized();
        let accessToken = req.headers["x-auth-token"]?.trim();
        let payload = await verifyAccessToken(accessToken);
        let agent = await Agent.findOne({
            where: {
                username: payload.username,
            },
        });
        console.log(agent);
        if (!agent) throw createError.Unauthorized();
        req.currentAgent = agent;
        next();
    } catch (err) {
        next(err);
    }
};
