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
        let data = req.body;
        if (data.type?.toUpperCase() === "HOSPITALIZED") {
            data = await episodeValidator(req.body, {
                type: 1,
                admType: 1,
                initDate: 1,
                entryDate: 1,
                service: 1,
                category: 1,
                exitDate: 2,
                situation: 2,
                tnErcure: 2,
                tName: 2,
            });
        } else if (data.type?.toUpperCase() === "EXTERNAL") {
            data = await episodeValidator(req.body, {
                type: 1,
                presentationNature: 1,
                initDate: 1,
                admType: 1,
            });
        } else {
            throw createError.BadRequest(
                "type must be one of [EXTERNAL, HOSPITALIZED]"
            );
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

const getEpisodes = async (req, res, next) => {
    try {
        let params = await patientValidator(req.params, { ipp: 1 });
        let query = req.query;
        let where = {
            patientId: params.ipp,
        };
        if (query.type) {
            query = await episodeValidator(req.query, { type: 1 });
            where.type = query.type;
        }
        let episodes = await Episode.findAll({
            where,
            attributes: {
                exclude: ["patientId"],
            },
            include: {
                model: Patient,
                as: "patient",
            },
        });
        res.json(episodes);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createEpisode,
    getEpisodes,
};
