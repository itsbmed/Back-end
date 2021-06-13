const router = require("express").Router();
const analyticController = require("../controllers/analyticController");
const protectRouter = require("../middlewares/protectRouter");

router.use(protectRouter);
router.get("/analytics", analyticController.getStatistics);

module.exports = router;
