const { Episode, Bill, Patient, Agent } = require("../models");
const sequelize = require("sequelize");
const { episodeValidator } = require("../helpers/validationSchema");

const getStatistics = async (req, res, next) => {
    try {
        let query = await episodeValidator(req.query, {
            type: 1,
            from: 1,
            to: 1,
            },
            {
                merge: billSchema,
            }
        );
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
            options.where[sequelize.Op.or] = [
                {
                    presentationNature: "LAB",
                },
                {
                    presentationNature: "RADIO",
                },
            ];
            options.attributes.push("presentationNature");
            options.group.push("presentationNature");
        }

        let result = await Episode.findAll(options);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

const getTotals = async (req, res, next) => {
    try {
        let results = {};
        results.agentCount = await Agent.count();
        results.patientCount = await Patient.count();
        results.billCount = await Bill.count();
        results.episodeCount = await Episode.count();
        res.json(results);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getStatistics,
    getTotals,
};
