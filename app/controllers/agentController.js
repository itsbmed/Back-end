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
        }
        let isValidPassword = await agent.checkPassword(data.passWord);
        if (!isValidPassword) {
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

const updateAgent = async (req, res, next) => {
    try {
        let currentAgent = req.currentAgent;
        if (!currentAgent.isAdmin) throw createError.Forbidden();
        let data = await agentValidator(req.body, {
            userName: 2,
            passWord: 2,
            firstName: 2,
            lastName: 2,
            isAdmin: 2,
        });
        let newData = { ...currentAgent.dataValues, ...data };
        await currentAgent.updateAgent(newData);
        if (data.passWord) await currentAgent.hashPassword();
        await currentAgent.save();
        res.json(currentAgent);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    signIn,
    signUp,
    updateAgent,
};
