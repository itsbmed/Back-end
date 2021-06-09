const createError = require("http-errors");
const { Episode, Patient, Bill } = require("../models");
const sequelize = require("sequelize");
const {
    episodeValidator,
    patientValidator,
} = require("../helpers/validationSchema");
const getPagination = require("../helpers/getPagination");

// create a new episode for patient
const createEpisode = async (req, res, next) => {
    try {
        let params = await patientValidator(req.params, { ipp: 1 });
        let data = req.body;
        if (data.type?.toUpperCase() === "HOSPITALIZED") {
            data = await episodeValidator(req.body, {
                type: 1,
                admType: 1,
                firstName: 1,
                lastName: 1,
                cin: 1,
                address: 1,
                entryDate: 1,
                service: 1,
                presentationNature: 1,
                category: 1,
                ramedNum: 2,
                ramedExpDate: 2,
            });
        } else if (data.type?.toUpperCase() === "EXTERNAL") {
            data = await episodeValidator(req.body, {
                type: 1,
                admType: 1,
                firstName: 1,
                lastName: 1,
                cin: 1,
                address: 1,
                presentationNature: 1,
                category: 1,
                ramedNum: 2,
                ramedExpDate: 2,
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
        let query = await episodeValidator(req.query, { type: 2, page: 2 });
        let episodeQuery = {
            patientId: params.ipp,
        };
        if (query.type) episodeQuery.type = query.type;
        let episodes = await Episode.findAll({
            where: episodeQuery,
            ...getPagination(query.page),
            attributes: {
                exclude: ["patientId"],
            },
            include: [
                {
                    model: Patient,
                    as: "patient",
                },
                {
                    model: Bill,
                    as: "bill",
                },
            ],
        });
        res.json(episodes);
    } catch (err) {
        next(err);
    }
};

const updateEpisode = async (req, res, next) => {
    try {
        let params = await episodeValidator(req.params, { id: 1 });
        let query = await episodeValidator(req.query, { type: 1 });
        let data = {};
        // clean req.body from null properties
        Object.keys(req.body).forEach((key) => {
            if (!req.body[key]) delete req.body[key];
        });
        if (query.type === "HOSPITALIZED") {
            data = await episodeValidator(req.body, {
                admType: 2,
                firstName: 2,
                lastName: 2,
                cin: 2,
                address: 2,
                service: 2,
                presentationNature: 2,
                category: 2,
                ramedNum: 2,
                ramedExpDate: 2,
            });
        } else if (query.type === "EXTERNAL") {
            data = await episodeValidator(req.body, {
                admType: 2,
                firstName: 2,
                lastName: 2,
                cin: 2,
                address: 2,
                presentationNature: 2,
                category: 2,
                ramedNum: 2,
                ramedExpDate: 2,
            });
        }
        let episode = await Episode.findOne({
            where: {
                id: params.id,
                type: query.type,
            },
        });
        if (!episode) throw createError.NotFound("Episode not found !");
        let newData = { ...episode.dataValues, ...data };
        await episode.updateEpisode(newData);
        await episode.save();
        res.json(episode);
    } catch (err) {
        next(err);
    }
};

const deleteEpisode = async (req, res, next) => {
    try {
        let params = await episodeValidator(req.params, { id: 1 });
        let episode = await Episode.findOne({
            where: {
                id: params.id,
            },
        });
        if (!episode) throw createError.NotFound("Episode not found !");
        await episode.destroy();
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};

const getStatistics = async (req, res, next) => {
    try {
        let query = await episodeValidator(req.query, {
            type: 1,
            from: 1,
            to: 1,
        });
        let options = {
            where: {
                exitDate: {
                    [sequelize.Op.ne]: null,
                },
                createdAt: {
                    [sequelize.Op.between]: [query.from, query.to],
                },
            },
            attributes: [
                "category",
                [
                    sequelize.fn("SUM", sequelize.col("bill.total")),
                    "amountTotal",
                ],
                [
                    sequelize.fn("COUNT", sequelize.col("Episode.exitDate")),
                    "episodeCount",
                ],
            ],
            include: {
                model: Bill,
                attributes: [],
                as: "bill",
            },
            group: ["category"],
        };
        if (query.type) {
            options.where.type = query.type;
        }
        if (query?.type === "EXTERNAL") {
            options.attributes.unshift("presentationNature");
            options.group.unshift("presentationNature");
        }

        let result = await Episode.findAll(options);
        res.json(result);
    } catch (err) {
        next(err);
    }
};
module.exports = {
    createEpisode,
    getEpisodes,
    updateEpisode,
    deleteEpisode,
    getStatistics,
};
