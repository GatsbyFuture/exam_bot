const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");
const XLSX = require("xlsx");
const CustomError = require("../../core/errors/custom.error");


const {createAnswersSchema} = require("./answers.dto");
const AnswersHelpers = require("./answers.helpers");
const AnswersService = require("./answers.service");

class AnswersController extends AnswersService {

    async generateMarkupButtonsDynamic(back, lang) {

        const answers = await this.getAnswersWithFilter({});

        let buttons = await AnswersHelpers.generateAnswersBtn(answers, lang);

        buttons.btns.push([back]);

        return buttons;
    }

    async createByHand(text) {
        const data = await AnswersHelpers.polishingAnswersText(text);

        const {error} = createAnswersSchema.validate(data);

        if (error) {
            throw CustomError.InCorrectDtoError();
        }

        return {
            id: await this.createAnswersByHand(data),
            key: "ans"
        };
    }

    async createByExcel(text, file, file_name) {
        const {success, file_path} = await AnswersHelpers.createAnswerDocument(file_name, file);

        if (!success) {
            throw CustomError.SaveDocumentsError();
        }

        const workbook = XLSX.readFile(file_path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(worksheet, {header: ["num", "key", "score"]});

        const {success: ok, variants} = await AnswersHelpers.polishingAnswersExcel(data);

        if (!ok) {
            throw CustomError.ReadingExcelError();
        }

        return {
            id: await this.createAnswersByExcel(variants), // number of answers
            key: "ans_xls"
        };
    }

    async showAnswers(answers, lang) {
        return AnswersHelpers.generateAnswersText(answers, lang);
    }
}

module.exports = new AnswersController();