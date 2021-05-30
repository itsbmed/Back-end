const { Agent } = require("../models");
const createError = require("http-errors");
const { agentValidator } = require("../helpers/validationSchema");
const { signAccessToken } = require("../helpers/jwt");

const signIn = async (req, res, next) => {
    try {
        let data = await agentValidator(req.body, { username: 1, password: 1 });
        let agent = await Agent.findOne({
            where: {
                username: data.username,
            },
        });
        if (!agent) {
            throw createError.NotFound("Agent not found !");
        } else if (!agent.checkPassword(data.password)) {
            throw createError.Unauthorized("username/password incorrect");
        }
        const accessToken = await signAccessToken(data.username);
        delete agent.dataValues["password"];
        res.json({
            accessToken,
            agent,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    signIn,
};
