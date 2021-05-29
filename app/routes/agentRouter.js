const router = require("express").Router();
const agentController = require("../controllers/agentController");

router.post("/agents", agentController.signIn);

module.exports = router;
