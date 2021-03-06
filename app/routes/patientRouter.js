const router = require("express").Router();
const protectRouter = require("../middlewares/protectRouter");
const patientController = require("../controllers/patientController");

// protect the route from any unauthorized request
router.use(protectRouter);
router.post("/patients", patientController.addPatient);
router.get("/patients/:ipp", patientController.getPatient);

module.exports = router;
