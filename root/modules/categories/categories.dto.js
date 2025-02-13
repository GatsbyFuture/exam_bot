const Joi = require("joi");

const CreateCategoryDto = {
        title: {
            oz: "string",
            uz: "string"
        },
        desc: {
            oz: "string",
            uz: "string"
        },
        position: 0 // position is optional
    }
;

const createCategorySchema = Joi.object({
    title: {
        oz: Joi.string().required(),
        uz: Joi.string()
    },
    desc: {
        oz: Joi.string().required(),
        uz: Joi.string()
    },
    position: Joi.optional()
});

module.exports = {
    CreateCategoryDto,
    createCategorySchema
};