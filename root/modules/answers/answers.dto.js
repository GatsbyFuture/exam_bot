const Joi = require("joi");

const StaticStruct = {
    sheet: Joi.number().required(),
    answers: Joi.array()
        .items(
            Joi.object({
                num: Joi.number().required(),
                key: Joi.string().valid("A", "B", "C", "D", "E").required()
            })
        ).required(),
    position: Joi.optional()
};

const CreateAnswersDto = {
    sheet_id: 0,
    answers: "string",
    position: 0 // optional
};

const createAnswersSchema = Joi.object(StaticStruct);

const checkAnswersSchema = Joi.object(StaticStruct);

module.exports = {
    CreateAnswersDto,
    createAnswersSchema,
    checkAnswersSchema
};