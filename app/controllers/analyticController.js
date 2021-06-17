const { Episode, Bill, Patient, Agent } = require("../models");
const sequelize = require("sequelize");
const { episodeValidator, billSchema } = require("../helpers/validationSchema");

const getStatistics = async (req, res, next) => {
    try {
        let query = await episodeValidator(
            req.query,
            {
                type: 1,
                from: 1,
                to: 1,
                totalOf: 1,
                service: 2,
                admType: 2,
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
        if (query.admType) {
            options.where.admType = query.admType;
        }
        if (query.service) {
            options.where.service = query.service;
        }
        if (query.totalOf) {
            options.attributes.push([
                sequelize.fn("SUM", sequelize.col(`bill.${query.totalOf}`)),
                "amountTotal",
            ]);
        }
        if (query?.type === "EXTERNAL") {
            options.where[sequelize.Op.or] = [
                {
                    presentationNature: "LAB",
                },
                {
                    presentationNature: "RADIO",
                },
                {
                    presentationNature: "CONSULTATION",
                },
            ];
            options.attributes.push("presentationNature");
            options.group.push("presentationNature");
        } else if (query?.type === "HOSPITALIZED") {
            options.attributes.push("hospitalDay");
            options.group.push("hospitalDay");
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
