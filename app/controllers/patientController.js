const { Patient } = require("../models");
const { patientValidator } = require("../helpers/validationSchema");
const createError = require("http-errors");

const addPatient = async (req, res, next) => {
    try {
        let data = await patientValidator(req.body, {
            ipp: 1,
            firstName: 1,
            lastName: 1,
        });
        let patient = await Patient.findOne({
            where: {
                ipp: data.ipp,
            },
        });
        if (patient) throw createError.Conflict();
        patient = Patient.build(data);
        await patient.save();
        res.status(201).json(patient);
    } catch (err) {
        next(err);
    }
};

const getPatient = async (req, res, next) => {
    try {
        let params = await patientValidator(req.params, { ipp: 1 });
        let patient = await Patient.findOne({
            where: {
                ipp: params.ipp,
            },
        });
        if (!patient) throw createError.NotFound("Patient not found !");
        res.json(patient);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    addPatient,
    getPatient,
};
