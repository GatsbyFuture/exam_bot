const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");
const CustomError = require("../../core/errors/custom.error");

const SheetsService = require("../sheets/sheets.service");

const {createAnswersSchema} = require("./answers.dto");
const AnswersHelpers = require("./answers.helpers");
const AnswersService = require("./answers.service");

class AnswersController extends AnswersService {
    sheetsService = new SheetsService();

    async generateMarkupButtonsDynamic(back, lang) {

        const answers = await this.getAnswersWithFilter({});

        let buttons = await AnswersHelpers.generateAnswersBtn(answers, lang);

        buttons.btns.push([back]);

        return buttons;
    }

    async createByHand(text) {
        const data = await AnswersHelpers.polishingAnswersData(text);

        const {error} = createAnswersSchema.validate(data);

        const hasSheet = await this.sheetsService.getBySheetId(data.sheet);

        if (!hasSheet) {
            throw CustomError.SheetNotFoundError();
        }

        if (error) {
            throw CustomError.InCorrectDtoError();
        }

        data.sheet_id = hasSheet._id;

        const newAnswers = await this.createAnswer(data);

        await this.sheetsService.updateSheet(
            {_id: hasSheet._id},
            {has_answers: true}
        );

        return {
            key: "answers", // detect for which collection...
            id: newAnswers.answers_id
        };
    }

    async createByExcel(text, file, file_name) {
        const {success, file_path} = await AnswersHelpers.createAnswerDocument(file_name, file);

        if (!success) {
            throw CustomError.SaveDocumentsError();
        }

        data.file_path = file_path;
        console.log(file_path);

        return {
            key: "answers", // detect for which collection...
            id: 13
        };
    }

    async showAnswers(answers, lang) {
        return AnswersHelpers.generateAnswersText(answers, lang);
    }
}

module.exports = new AnswersController();