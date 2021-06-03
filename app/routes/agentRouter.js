const router = require("express").Router();
const agentController = require("../controllers/agentController");
const protectRouter = require("../middlewares/protectRouter");

router.post("/sign-in", agentController.signIn);
router.post("/sign-up", protectRouter, agentController.signUp);
router.get("/agents", protectRouter, agentController.getAgents);
router.delete(
    "/agents/:userName",
    protectRouter,
    agentController.deleteSpecifcAgent
);
router.put(
    "/agents/:userName",
    protectRouter,
    agentController.updateSpecificAgent
);
module.exports = router;
