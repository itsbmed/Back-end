const router = require("express").Router();
const protectRouter = require("../middlewares/protectRouter");
const billControlelr = require("../controllers/billController");

router.use(protectRouter);
router.post("/episodes/:episodeId/bills", billControlelr.addBill);
router.get("/bills", billControlelr.getBills);
router.put("/bills/:id", billControlelr.updateBill);
module.exports = router;
