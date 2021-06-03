const router = require("express").Router();
const agentController = require("../controllers/agentController");
const protectRouter = require("../middlewares/protectRouter");

router.post("/sign-in", agentController.signIn);
router.post("/sign-up", protectRouter, agentController.signUp);
router.put("/agents", protectRouter, agentController.updateAgent);
router.delete("/agents", protectRouter, agentController.deleteAgent);
router.get("/agents", protectRouter, agentController.getAgents);
module.exports = router;
