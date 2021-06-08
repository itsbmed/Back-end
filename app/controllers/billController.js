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
            organismPart: 1,
            adherentPart: 1,
            billNum: 1,
            billDate: 1,
            medicalBiology: 1,
            medicalImaging: 1,
            prosthesis: 1,
            invoicedStay: 1,
            medicalFees: 1,
            billedMedication: 1,
            actes: 1,
            total: 1,
        });
        let episode = await Episode.findOne({
            where: {
                id: params.episodeId,
            },
            include: {
                model: Bill,
                as: "bill",
            },
        });
        if (!episode) throw createError.NotFound("Episode not found !");
        else if (episode.bill)
            throw createError.Conflict("Episode already has a bill !");
        data.episodeId = params.episodeId;
        // TODO : check if bill already exists using  billNum field and add it as unique field in model
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

const updateBill = async (req, res, next) => {
    try {
        let params = await billValidator(req.params, { id: 1 });
        let data = await billValidator(req.body, {
            organismPart: 2,
            adherentPart: 2,
            billNum: 2,
            billDate: 2,
            medicalBiology: 2,
            medicalImaging: 2,
            prosthesis: 2,
            invoicedStay: 2,
            medicalFees: 2,
            billedMedication: 2,
            actes: 2,
            total: 2,
        });
        let bill = await Bill.findOne({
            where: {
                id: params.id,
            },
        });
        if (!bill) throw createError.NotFound("Bill not found !");

        let newData = { ...bill.dataValues, ...data };
        await bill.updateBill(newData);
        await bill.save();

        res.json(bill);
    } catch (err) {
        next(err);
    }
};
module.exports = {
    addBill,
    getBills,
    updateBill,
};
