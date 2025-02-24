const Markup = require("telegraf/markup");
const config = require("./admin.config");
const BtnMethods = require("../../core/enums/btn.method.enum");
const Collections = require("../../core/enums/collections.enum");
const {toCyrillic} = require("../../libs/libs.latin.to.cyril");

const CustomError = require("../../core/errors/custom.error");

const CoreService = require("../../core/service/core.service");
const CoreHelpers = require("../../core/helpers/core.helpers");

const {checkDeleteSchema} = require("./admin.dto");
const AdminHelpers = require("./admin.helpers");


const CategoriesController = require("../categories/categories.controller");

const SheetsController = require("../sheets/sheets.controller");

const AnswersController = require("../answers/answers.controller");

class AdminController extends CoreService {
    async statistics() {
        const total_categories = await CategoriesController.getCountCategories();
        const total_sheets = await SheetsController.getCountSheets();
        const total_answers = await AnswersController.getCountAnswers();

        return {
            total_categories,
            total_sheets,
            total_answers
        };
    }

    async generateAdminMarkButtons(ctx, cat_id = 0) {
        const {_id, level, lang} = ctx.session.user;

        await this.updateLevel(_id, level);

        const btn_keys = config.MARKUP_BUTTONS_LIST[level];

        if (Array.isArray(btn_keys)) {
            // get static buttons from config
            return await CoreHelpers.generateMarkupButtonsStatic(ctx, btn_keys, level);
        } else {
            // get data from db and generate buttons
            const back = Markup.button(ctx.i18n.t("back"));
            if (btn_keys["method"] === BtnMethods.READ) {
                if (btn_keys["collection"] === Collections.CATEGORIES) {
                    return await CategoriesController.generateMarkupButtonsDynamic(
                        back,
                        lang,
                    );
                }
                if (btn_keys["collection"] === Collections.SHEETS) {
                    return await SheetsController.generateMarkupButtonsDynamic(
                        back,
                        lang,
                        cat_id
                    );
                }
                if (btn_keys["collection"] === Collections.ANSWERS) {
                    return await AnswersController.generateMarkupButtonsDynamic(
                        back,
                        lang,
                    );
                }

            } else if (btn_keys["method"] === BtnMethods.CREATE) {
                return await CoreHelpers.generateMarkupButtonsStatic(
                    ctx,
                    [],
                    level
                );
            } else if (btn_keys["method"] === BtnMethods.DELETE) {
                return await CoreHelpers.generateMarkupButtonsStatic(
                    ctx,
                    [],
                    level
                );
            }
        }
    }

    async ShowSheet(ctx, id) {
        const {lang} = ctx.session.user;

        const sheet = await SheetsController.getBySheetId(id);

        if (!sheet) {
            throw CustomError.SheetNotFoundError(ctx.i18n.t("sheet_not_found"));
        }

        await CoreHelpers.sendTestDocument(ctx, lang, sheet);
    }

    async createData(ctx, level) {
        const btn_keys = config.MARKUP_BUTTONS_LIST[level];
        const {text, file, file_type, file_name} = ctx.session;

        if (btn_keys["collection"] === Collections.CATEGORIES) {
            return CategoriesController.create(text);
        }

        if (btn_keys["collection"] === Collections.SHEETS) {
            return SheetsController.create(text, file, file_type);
        }

        if (btn_keys["collection"] === Collections.ANSWERS) {
            if (!file_name) {
                return AnswersController.createByHand(text);
            } else {
                return AnswersController.createByExcel(text, file, file_name);
            }
        }
    }

    async viewTestAnswers(ctx, id, lang) {
        const answers = await AnswersController.getAnswersOne(id);

        if (!answers) {
            throw CustomError.SheetNotFoundError(ctx.i18n.t("admin_sheet_not_found"));
        }

        const {
            sheet_title,
            answers_id,
            answers_text
        } = await AnswersController.showAnswers(answers, lang);

        const answersList = ctx.i18n.t("sheet_answers_list")
            .replace("*{sheet_title}*", sheet_title)
            .replace("*{answers_id}*", answers_id)
            .replace("*{answers_text}*", answers_text);

        await ctx.replyWithHTML(answersList);
    }

    async deleteData(ctx) {
        const {text} = ctx.session;

        const data = await AdminHelpers.polishingDeleteData(text);

        const {error} = checkDeleteSchema.validate(data);

        if (error) {
            throw CustomError.InCorrectDtoError(ctx.i18n.t("admin_dto_incorrect"));
        }
        const {type, id} = data;

        if (type === Collections.CATEGORIES) {
            await CategoriesController.deleteCategory(id);
            return {
                key: "category", // detect for which collection...
                id: id
            };
        }

        if (type === Collections.SHEETS) {
            await SheetsController.deleteSheet(id);
            return {
                key: "sheet", // detect for which collection...
                id: id
            };
        }

        if (type === Collections.ANSWERS) {
            await AnswersController.deleteAnswer(id);
            return {
                key: "answers", // detect for which collection...
                id: id
            };
        }

        throw CustomError.InternalError();
    }

    async changeLang(ctx) {
        CoreHelpers.langs(ctx);
    }
}

module.exports = new AdminController();





