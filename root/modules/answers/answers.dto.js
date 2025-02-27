const Joi = require("joi");

const StaticStruct = {
    sheet: Joi.number().required(),
    answers: Joi.array()
        .items(
            Joi.object({
                num: Joi.number().integer().required(),
                key: Joi.array()
                    .items(Joi.string().allow(""))
                    .min(1)
                    .required(),
                score: Joi.array()
                    .items(Joi.number().required())
                    .min(1)
                    .optional()
                    .custom((value, helpers) => {
                        if (value) {
                            const keyLength = helpers.state.ancestors[0].key.length;
                            if (value.length !== keyLength) {
                                return helpers.error("array.length", {expected: keyLength});
                            }
                        }
                        return value;
                    }, "Answers and score are length must be equals!")
            })
        )
        .required(),
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