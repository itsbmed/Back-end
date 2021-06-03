const { Agent } = require("../models");

module.exports = async (payload) => {
    try {
        let agent = await Agent.findOne({
            where: {
                userName: payload.userName,
            },
        });
        if (!agent) {
            agent = Agent.build(payload);
            await agent.hashPassword();
            await agent.save();
            console.log("Creating agent admin...");
        } else {
            console.log("Agent admin already created !");
        }
    } catch (err) {
        throw err;
    }
};
