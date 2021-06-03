const createError = require("http-errors");
const { Bill, Episode } = require("../models");
const { billValidator } = require("../helpers/validationSchema");
const addBill = async (req, res, next) => {
    try {
        let params = await billValidator(req.params, {
            episodeId: 1,
        });
        let data = await billValidator(req.body, {
            nReceipt: 1,
            nBill: 1,
            nature: 1,
            actes: 1,
            total: 1,
            category: 1,
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
        res.status(201).json(bill);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    addBill,
};
