const router = require("express").Router();
const agentController = require("../controllers/agentController");
const protectRouter = require("../middlewares/protectRouter");

router.post("/sign-in", agentController.signIn);
router.post("/sign-up", protectRouter, agentController.signUp);
module.exports = router;
