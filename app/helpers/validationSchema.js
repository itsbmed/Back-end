const joi = require("joi");

const validator = (schema, selectors = {}) => {
    const requiredFields = [];
    const optionalFields = [];
    const forbiddenFields = [];
    schema._ids._byKey.forEach((el) => {
        switch (selectors[el.id]) {
            case 1:
                requiredFields.push(el.id);
                break;
            case 2:
                optionalFields.push(el.id);
                break;
            default:
                forbiddenFields.push(el.id);
        }
    });
    schema = schema.fork(requiredFields, (field) => field.required());
    schema = schema.fork(optionalFields, (field) => field.optional());
    schema = schema.fork(forbiddenFields, (field) => field.forbidden());
    return schema;
};

const agentValidator = async (credentials, selectors) => {
    try {
        let agentSchema = joi.object({
            firstName: joi.string().min(2).max(10).optional().trim(),
            lastName: joi.string().min(2).max(10).optional().trim(),
            userName: joi
                .string()
                .pattern(/[a-zA-Z0-9\-\_]{4,6}/)
                .message("Please fill a valid username")
                .required()
                .trim(),
            passWord: joi.string().required().min(4).max(16),
            isAdmin: joi.boolean().default(false),
            page: joi.number().greater(0).default(1),
        });
        agentSchema = validator(agentSchema, selectors);
        return await agentSchema.validateAsync(credentials);
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
        }
        throw err;
    }
};

const patientValidator = async (credentials, selectors) => {
    try {
        let patientSchema = joi.object({
            ipp: joi.number().min(100000).required(),
            firstName: joi.string().min(2).max(30).trim(),
            lastName: joi.string().min(2).max(30).trim(),
            nCode: joi
                .string()
                .regex(/^[0-9]{15,25}$/)
                .message("Please fill a valid nCode")
                .optional()
                .default(null),
            nDate: joi
                .string()
                .regex(/^([0-9]{2})\/([0-9]{2})$/)
                .message("Please fill a valid nDate")
                .optional()
                .default(null),
            page: joi.number().greater(0).default(1),
        });
        patientSchema = validator(patientSchema, selectors);
        return await patientSchema.validateAsync(credentials);
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
        }
        throw err;
    }
};
const episodeValidator = async (credentials, selectors) => {
    try {
        let episodeSchema = joi.object({
            id: joi.number(),
            patientId: joi.number().min(100000).required(),
            type: joi.string().uppercase().valid("EXTERNAL", "HOSPITALIZED"),
            category: joi.string().uppercase().valid("P,P", "RAMED", "MAFAR"),
            initDate: joi.date(),
            entryDate: joi.date(),
            exitDate: joi.date(),
            presentationNature: joi.string().uppercase().valid("CS/SP", "RX"),
            service: joi
                .string()
                .uppercase()
                .valid("P1", "P2", "P3", "P4", "CH-A", "CH-B", "CH-C", "CH-D"),
            situation: joi.string(),
            tnErcure: joi.string(),
            admType: joi.string().uppercase().valid("URGENT", "NORMAL"),
            tName: joi.string(),
            page: joi.number().greater(0).default(1),
        });
        episodeSchema = validator(episodeSchema, selectors);
        return await episodeSchema.validateAsync(credentials);
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
        }
        throw err;
    }
};
const billValidator = async (credentials, selectors) => {
    try {
        let billSchema = joi.object({
            nReceipt: joi.number(),
            nBill: joi.number(),
            nature: joi.string().trim(),
            category: joi.string().uppercase().valid("PAYANT", "RAMED"),
            episodeId: joi.number(),
            medicament: joi.number().default(0),
            actes: joi.number(),
            total: joi.number().custom((value, helpers) => {
                let state = helpers.state.ancestors[0];
                if (
                    value ===
                    state.medicament + state.actes + state.prosthesis
                ) {
                    return value;
                } else {
                    return helpers.message("Please fill a valid total !");
                }
            }),
            prosthesis: joi.number().default(0),
            page: joi.number().greater(0).default(1),
        });
        billSchema = validator(billSchema, selectors);
        return await billSchema.validateAsync(credentials);
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
        }
        throw err;
    }
};
module.exports = {
    agentValidator,
    patientValidator,
    episodeValidator,
    billValidator,
};
