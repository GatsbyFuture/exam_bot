const Joi = require("joi");

const CheckDeleteDto = {
    type: "categories:634..7 || answers:214..4 || sheets:134..2",
};

const checkDeleteSchema = Joi.object({
    type: Joi.string().required(),
    id: Joi.number().required(),
});

module.exports = {
    CheckDeleteDto,
    checkDeleteSchema,
};