const CustomError = require("../../core/errors/custom.error");
const AdminService = require("./admin.service");
const AdminHelpers = require("./admin.helpers");
const {checkDeleteSchema} = require("./admin.dto");

const HelpersCore = require("../../core/helpers/helpers.core");

const CategoriesService = require("../categories/categories.service");
const CategoriesHelpers = require("../categories/categories.helpers");
const {createCategorySchema} = require("../categories/categories.dto");

const SheetsService = require("../sheets/sheets.service");
const SheetsHelpers = require("../sheets/sheets.helpers");
const {createSheetSchema} = require("../sheets/sheets.dto");

const AnswersService = require("../answers/answers.service");
const AnswersHelpers = require("../answers/answers.helpers");
const {createAnswersSchema} = require("../answers/answers.dto");

const BtnMethods = require("../../core/enums/btn.method.enum");
const Collections = require("../../core/enums/collections.enum");
const config = require("./admin.config");
const {toCyrillic} = require("../../libs/libs.latin.to.cyril");
const {cap} = require("lodash/fp/_falseOptions");


class AdminController extends AdminService {
    async statistics() {
        const total_categories = await CategoriesService.getCountCategories();
        const total_sheets = await SheetsService.getCountSheets();
        const total_answers = await AnswersService.getCountAnswers();

        return {
            total_categories,
            total_sheets,
            total_answers
        };
    }

    async generateAdminMarkButtons(ctx, data, cat_id = 0) {
        const [_id, level] = data;

        await this.updateLevel(_id, level);

        const btn_keys = config.MARKUP_BUTTONS_LIST[level];

        if (Array.isArray(btn_keys)) {
            // get static buttons from config
            return await HelpersCore.generateMarkupButtons(ctx,btn_keys,level);
        } else {
            // get data from db and generate buttons
            if (btn_keys["method"] === BtnMethods.READ) {
                return await HelpersCore.generateMarkupButtonsDynamic(
                    ctx,
                    ctx.session.user.lang,
                    btn_keys,
                    cat_id
                );
            } else if (btn_keys["method"] === BtnMethods.CREATE) {
                return await HelpersCore.generateMarkupButtons(
                    ctx,
                    [],
                    level
                );
            } else if (btn_keys["method"] === BtnMethods.DELETE) {
                return await HelpersCore.generateMarkupButtons(
                    ctx,
                    [],
                    level
                );
            }
        }
    }

    async generateAgreeButton(ctx) {
        return HelpersCore.generateMarkupBtnAgree(ctx);
    }

    async createData(ctx, level) {
        const btn_keys = config.MARKUP_BUTTONS_LIST[level];

        if (btn_keys["collection"] === Collections.CATEGORIES) {
            const text = ctx.session.text;
            const data = await CategoriesHelpers.polishingCategoryData(text);

            const {error} = createCategorySchema.validate(data);

            if (error) {
                throw CustomError.InCorrectDtoError(ctx.i18n.t("admin_dto_incorrect"));
            }
            data.title.uz = toCyrillic(data.title.oz);
            data.desc.uz = toCyrillic(data.desc.oz);

            const newCategory = await CategoriesService.createCategory(data);

            return {
                key: "category", // detect for which collection...
                id: newCategory.category_id
            };
        }

        if (btn_keys["collection"] === Collections.SHEETS) {
            // code for creating test
            const {text, file} = ctx.session;
            // console.log(text, file);

            const data = await SheetsHelpers.polishingSheetData(text);
            const {error} = createSheetSchema.validate(data);

            if (error) {
                throw CustomError.InCorrectDtoError(ctx.i18n.t("admin_dto_incorrect"));
            }

            const {success, file_path} = await SheetsHelpers.createSheetDocument(file);

            if (!success) {
                throw CustomError.SaveDocumentsError(ctx.i18n.t("admin_saved_data_error"));
            }

            data.file_path = file_path;
            data.title.uz = toCyrillic(data.title.oz);
            data.desc.uz = toCyrillic(data.desc.oz);

            const newSheet = await SheetsService.createSheet(data);

            return {
                key: "sheet", // detect for which collection...
                id: newSheet.sheet_id// replace with real id
            };
        }

        if (btn_keys["collection"] === Collections.ANSWER) {
            const text = ctx.session.text;
            const data = await AnswersHelpers.polishingAnswersData(text);

            const {error} = createAnswersSchema.validate(data);

            const hasSheet = await SheetsService.getByIdSheet(data.sheet_id);

            if (!hasSheet) {
                throw CustomError.TestNotFoundError(ctx.i18n.t("admin_sheet_not_found"));
            }

            if (error) {
                throw CustomError.InCorrectDtoError(ctx.i18n.t("admin_dto_incorrect"));
            }
            // get uuid of sheet
            const sheet = await SheetsService.getByIdSheet(data.sheet_id);
            data.sheet_id = sheet._id;
            const newAnswers = await AnswersService.createAnswer(data);

            return {
                key: "answers", // detect for which collection...
                id: newAnswers.answers_id
            };
        }
    }

    async viewTestAnswers(ctx, id, lang) {
        const answers = await AnswersService.getAnswersOne(id);

        if (!answers) {
            throw CustomError.TestNotFoundError(ctx.i18n.t("admin_sheet_not_found"));
        }

        const {
            sheet_title,
            answers_id,
            answers_text
        } = await AnswersHelpers.generateAnswersShow(answers, lang);

        const answersList = ctx.i18n.t("sheet_answers_list")
            .replace("*{sheet_title}*", sheet_title)
            .replace("*{answers_id}*", answers_id)
            .replace("*{answers_text}*", answers_text);

        await ctx.replyWithHTML(answersList);
    }

    async deleteData(ctx, level) {
        const text = ctx.session.text;
        const data = await AdminHelpers.polishingDeleteData(text);

        const {error} = checkDeleteSchema.validate(data);

        if (error) {
            throw CustomError.InCorrectDtoError(ctx.i18n.t("admin_dto_incorrect"));
        }
        const {type, id} = data;

        if (type === Collections.CATEGORIES) {
            await CategoriesService.deleteCategory(id);
            return {
                key: "category", // detect for which collection...
                id: id
            };
        }

        if (type === Collections.SHEETS) {
            await SheetsService.deleteSheet(id);
            return {
                key: "sheet", // detect for which collection...
                id: id
            };
        }

        if (type === Collections.ANSWER) {
            await AnswersService.deleteAnswers(id);
            return {
                key: "answers", // detect for which collection...
                id: id
            };
        }

        throw CustomError.InCorrectDtoError(ctx.i18n.t("admin_dto_incorrect"));
    }

    async changeLang(ctx) {
        HelpersCore.langs(ctx);
    }
}

module.exports = new AdminController();





