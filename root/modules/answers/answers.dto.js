const Joi = require("joi");

const StaticStruct = {
    sheet: Joi.number().required(),
    answers: Joi.array()
        .items(
            Joi.object({
                num: Joi.number().integer().required(),
                key: Joi.array()
                    .items(
                        Joi.string().allow("")
                    )
                    .min(1)
                    .required()
            })
        )
        .required(),
    position: Joi.number().integer().optional()
};

const EnteredAnswers = {
    sheet: Joi.number().required(),
    answers: Joi.array()
        .items(
            Joi.object({
                num: Joi.number().integer().required(),
                key: Joi.array()
                    .items(
                        Joi.string().allow("")
                    )
                    .min(1)
                    .required()
            })
        )
        .required(),
};

const CreateAnswersDto = {
    sheet_id: 0,
    answers: "string",
    position: 0 // optional
};

const createAnswersSchema = Joi.object(StaticStruct);

const checkAnswersSchema = Joi.object(EnteredAnswers);

module.exports = {
    CreateAnswersDto,
    createAnswersSchema,
    checkAnswersSchema
};