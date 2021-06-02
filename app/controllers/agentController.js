const { Agent } = require("../models");
const createError = require("http-errors");
const { agentValidator } = require("../helpers/validationSchema");
const { signAccessToken } = require("../helpers/jwt");

const signIn = async (req, res, next) => {
    try {
        let data = await agentValidator(req.body, { userName: 1, passWord: 1 });
        let agent = await Agent.findOne({
            where: {
                userName: data.userName,
            },
        });
        if (!agent) {
            throw createError.NotFound("Agent not found !");
        } else if (!agent.checkPassword(data.passWord)) {
            throw createError.Unauthorized("username/password incorrect");
        }
        const accessToken = await signAccessToken(data.userName);
        delete agent.dataValues["passWord"];
        res.json({
            accessToken,
            agent,
        });
    } catch (err) {
        next(err);
    }
};
const signUp = async (req, res, next) => {
    try {
        let currentAgent = req.currentAgent;
        if (!currentAgent.isAdmin) throw createError.Forbidden();
        let data = await agentValidator(req.body, {
            userName: 1,
            passWord: 1,
            firstName: 1,
            lastName: 1,
            isAdmin: 2,
        });
        let agent = await Agent.findOne({
            where: {
                userName: data.userName,
            },
        });
        if (agent) throw createError.Conflict();
        let newAgent = Agent.build(data);
        await newAgent.hashPassword();
        await newAgent.save();
        newAgent.passWord = undefined;
        res.json(newAgent);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    signIn,
    signUp,
};
