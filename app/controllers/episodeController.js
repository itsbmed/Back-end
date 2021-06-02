const createError = require("http-errors");
const { Episode, Patient } = require("../models");
const {
    episodeValidator,
    patientValidator,
} = require("../helpers/validationSchema");

// create a new episode for patient
const createEpisode = async (req, res, next) => {
    try {
        let params = await patientValidator(req.params, { ipp: 1 });
        let data = {};
        if (req.body.type === "hospitalized") {
            data = await episodeValidator(req.body, {
                type: 1,
                initDate: 1,
                entryDate: 1,
                service: 1,
                category: 1,
            });
        } else if (req.body.type === "external") {
            data = await episodeValidator(req.body, {
                type: 1,
                presentationNature: 1,
                initDate: 1,
            });
        } else {
            throw createError.BadRequest();
        }
        let patient = await Patient.findOne({
            where: {
                ipp: params.ipp,
            },
        });
        if (!patient) throw createError.NotFound("Patient not found !");
        data.patientId = patient.ipp;

        let episode = Episode.build(data);

        await episode.save();
        res.json(episode);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createEpisode,
};
