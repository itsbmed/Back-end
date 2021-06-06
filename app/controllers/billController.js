const createError = require("http-errors");
const { Bill, Episode } = require("../models");
const {
    billValidator,
    episodeValidator,
} = require("../helpers/validationSchema");
const getPagination = require("../helpers/getPagination");
const addBill = async (req, res, next) => {
    try {
        let params = await billValidator(req.params, {
            episodeId: 1,
        });
        let data = await billValidator(req.body, {
            nReceipt: 1,
            nBill: 1,
            actes: 1,
            total: 1,
            nature: 2,
            category: 2,
            prosthesis: 2,
            medicament: 2,
        });
        let episode = await Episode.findOne({
            where: {
                id: params.episodeId,
            },
        });
        if (!episode) throw createError.NotFound("Episode not found !");
        data.episodeId = params.episodeId;
        let bill = Bill.build(data);
        await bill.save();
        episode.exitDate = Date.now();
        await episode.save();
        res.status(201).json(bill);
    } catch (err) {
        next(err);
    }
};

const getBills = async (req, res, next) => {
    try {
        let query = await episodeValidator(req.query, {
            patientId: 1,
            type: 2,
            page: 2,
        });
        let episodeQuery = {
            patientId: query.patientId,
        };
        if (query.type) episodeQuery.type = query.type;
        let bills = await Bill.findAll({
            ...getPagination(query.page),
            include: {
                model: Episode,
                where: episodeQuery,
                as: "episode",
            },
        });
        res.json(bills);
    } catch (err) {
        next(err);
    }
};
module.exports = {
    addBill,
    getBills,
};
