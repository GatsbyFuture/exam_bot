const Joi = require("joi");

const CreateSheetDto = {
    title: {
        oz: "string",
        uz: "string"
    },
    desc: {
        oz: "string",
        uz: "string"
    },
    category_id: 0, // position is optional
    position: 0 // position is optional
};

const createSheetSchema = Joi.object({
    title: {
        oz: Joi.string().required(),
        uz: Joi.string()
    },
    desc: {
        oz: Joi.string().required(),
        uz: Joi.string()
    },
    category_id: Joi.optional(),
    position: Joi.optional()
});

module.exports = {
    CreateSheetDto,
    createSheetSchema
};