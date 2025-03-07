const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");
const {toCyrillic} = require("../../libs/libs.latin.to.cyril");
const CustomError = require("../../errors/custom.error");

const {createSheetSchema} = require("./sheets.dto");
const SheetsHelpers = require("./sheets.helpers");
const SheetsService = require("./sheets.service");

class SheetsController extends SheetsService {
    async generateMarkupButtonsDynamic(back, lang, cat_id) {
        const query = {};

        if (cat_id) {
            query.category_id = cat_id;
        }

        const sheets = await this.getSheetWithFilter(query);

        let buttons = await SheetsHelpers.generateSheetBtn(sheets, lang);

        buttons.btns.push([back]);

        return buttons;
    }

    async create(text, file, file_type) {

        if (!file_type) {
            throw CustomError.DocumentNotFoundError();
        }

        const data = await SheetsHelpers.polishingSheetData(text);

        const {error} = createSheetSchema.validate(data);

        if (error) {
            throw CustomError.InCorrectDtoError();
        }

        const {success, file_path} = await SheetsHelpers.createSheetDocument(file_type, file);

        if (!success) {
            throw CustomError.SaveDocumentsError();
        }

        data.file_path = file_path;
        data.file_type = file_type;
        data.title.uz = toCyrillic(data.title.oz);
        data.desc.uz = toCyrillic(data.desc.oz);

        return {
            id: await this.createSheet(data),
            key: "she"
        };
    }
}

module.exports = new SheetsController();