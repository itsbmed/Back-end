const router = require("express").Router();
const protectRouter = require("../middlewares/protectRouter");
const billControlelr = require("../controllers/billController");

router.use(protectRouter);
router.post("/episodes/:episodeId/bills", billControlelr.addBill);
router.get("/bills", billControlelr.getBills);
module.exports = router;
