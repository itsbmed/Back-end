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

const deleteSpecifcAgent = async (req, res, next) => {
    try {
        let currentAgent = req.currentAgent;
        if (!currentAgent.isAdmin) throw createError.Forbidden();
        let params = await agentValidator(req.params, { userName: 1 });
        let agent;
        if (currentAgent.userName === params.userName) {
            agent = currentAgent;
        } else {
            agent = await Agent.findOne({
                where: {
                    userName: params.userName,
                },
            });
        }
        if (!agent) throw createError.NotFound("Agent not found !");
        await agent.destroy();
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};

const getAgents = async (req, res, next) => {
    try {
        let currentAgent = req.currentAgent;
        if (!currentAgent.isAdmin) throw createError.Forbidden();
        let agents = await Agent.findAll({
            attributes: ["id", "userName", "firstName", "lastName"],
        });
        res.json(agents);
    } catch (err) {
        next(err);
    }
};

const updateSpecificAgent = async (req, res, next) => {
    try {
        let currentAgent = req.currentAgent;
        if (!currentAgent.isAdmin) throw createError.Forbidden();
        let params = await agentValidator(req.params, { userName: 1 });
        let data = await agentValidator(req.body, {
            passWord: 2,
            firstName: 2,
            lastName: 2,
            isAdmin: 2,
        });
        let agent;
        if (currentAgent.userName === data.userName) {
            agent = currentAgent;
        } else {
            agent = await Agent.findOne({
                where: {
                    userName: params.userName,
                },
            });
        }
        if (!agent) throw createError.NotFound("Agent not found !");
        let newData = { ...agent.dataValues, ...data };
        await agent.updateAgent(newData);
        if (data.passWord) await agent.hashPassword();
        await agent.save();
        delete agent.dataValues["passWord"];
        res.json(agent);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    signIn,
    signUp,
    deleteSpecifcAgent,
    getAgents,
    updateSpecificAgent,
};
