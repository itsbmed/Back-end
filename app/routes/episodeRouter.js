const router = require("express").Router();
const episodeController = require("../controllers/episodeController");
const { episodeValidator } = require("../helpers/validationSchema");
const protectRouter = require("../middlewares/protectRouter");

router.use(protectRouter);
router.post("/episodes", episodeController.createEpisode);
module.exports = router;
