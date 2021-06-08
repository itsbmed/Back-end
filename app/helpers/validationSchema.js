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
            firstName: joi.string().min(2).max(30),
            lastName: joi.string().min(2).max(30),
            cin: joi.string().min(8).max(10),
            address: joi.string().max(255),
            type: joi.string().uppercase().valid("EXTERNAL", "HOSPITALIZED"),
            entryDate: joi.date(),
            exitDate: joi.date(),
            admType: joi.string().uppercase().valid("URGENT", "NORMAL"),
            ramedExpDate: joi.date(),
            ramedNum: joi.number().min(4).max(20),
            category: joi
                .string()
                .uppercase()
                .valid(
                    "PAID",
                    "POTENTIAL",
                    "RAMED",
                    "CNOPS",
                    "MAFAR",
                    "CNSS",
                    "ORGANISM"
                ),
            presentationNature: joi
                .string()
                .uppercase()
                .valid("LAB", "RADIO", "MEDICAL", "SURGICAL", "REANIMATION"),
            service: joi
                .string()
                .uppercase()
                .valid(
                    "P1",
                    "P2",
                    "P3",
                    "P4",
                    "CHA",
                    "CHB",
                    "CHC",
                    "CHD",
                    "CHOP",
                    "UPM",
                    "UPC",
                    "REAA",
                    "REAB"
                ),
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
            id: joi.number(),
            episodeId: joi.number(),
            organismPart: joi.number().default(0),
            adherentPart: joi.number().default(0),
            billNum: joi.string().min(4).max(10),
            billDate: joi.date(),
            medicalBiology: joi.number().default(0),
            medicalImaging: joi.number().default(0),
            prosthesis: joi.number().default(0),
            invoicedStay: joi.number().default(0),
            medicalFees: joi.number().default(0),
            billedMedication: joi.number().default(0),
            actes: joi.number().default(0),
            total: joi.number().default(0),
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
