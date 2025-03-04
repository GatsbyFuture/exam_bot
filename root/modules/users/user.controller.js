const dayjs = require("dayjs");
const Markup = require("telegraf/markup");
const config = require("./user.config");
const CustomError = require("../../errors/custom.error");

const BtnMethods = require("../../enums/btn.method.enum");
const Collections = require("../../enums/collections.enum");

const CoreService = require("../../core/service/core.service");
const CoreHelpers = require("../../core/helpers/core.helpers");

const CategoriesController = require("../categories/categories.controller");

const SheetsController = require("../sheets/sheets.controller");

const AnswersController = require("../answers/answers.controller");

const UsersAnsController = require("../users_ans/users_ans.controller");

class UserController extends CoreService {
    // async statistics() {
    //     const total_categories = await CategoriesController.getCountCategories();
    //     const total_sheets = await SheetsController.getCountSheets();
    //     const total_answers = await AnswersController.getCountAnswers();
    //
    //     return {
    //         total_categories,
    //         total_sheets,
    //         total_answers
    //     };
    // }
    async userStatistics(ctx, _id) {
        const text_key_words = {
            empty: ctx.i18n.t("not_found_usr_stc"),
            date: ctx.i18n.t("passed_date"),
            title: ctx.i18n.t("test_title"),
            total: ctx.i18n.t("total_tests"),
            total_corts: ctx.i18n.t("total_corts"),
            total_corts_score: ctx.i18n.t("total_corts_score"),
        };
        return await UsersAnsController.readUsersAns(text_key_words, _id);
    }

    async generateUserMarkButtons(ctx, cat_id = 0) {
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
            } else if (btn_keys["method"] === BtnMethods.CHECK) {
                return await CoreHelpers.generateMarkupButtonsStatic(ctx, [], level);
            }
        }
    }

    async ShowSheet(ctx, id) {
        const {lang} = ctx.session.user;
        const query = {
            sheet_id: id,
        };
        const sheet = await SheetsController.getSheetWithFilter(query);

        if (!sheet.length) {
            throw CustomError.SheetNotFoundError(ctx.i18n.t("sheet_not_found"));
        }

        await CoreHelpers.sendTestDocument(ctx, lang, sheet[0], true);
    }

    async sendRandomSheet(ctx, lang) {
        const sheet = await SheetsController.getRandomSheet();

        if (!sheet) {
            throw CustomError.SheetNotFoundError(ctx.i18n.t("sheet_not_found"));
        }
        // console.log(sheet);
        await CoreHelpers.sendTestDocument(ctx, lang, sheet, true);
    }

    async checkAnswers(ctx, lang) {
        const {_id, name} = ctx.session.user;
        const text = ctx.session.text;
        // get answers controller
        const {
            results,
            total,
            total_corrects,
            total_corrects_score,
            sheet,
            sheet_id
        } = await AnswersController.compareAnswers(text);

        const score = Math.floor(total_corrects_score);

        await UsersAnsController.create({
            user_id: _id,
            sheet_id,
            total,
            total_corrects,
            score
        });

        const header_text = ctx.i18n.t("user_answers_header")
            .replace("*{date}*", dayjs().format("DD-MM-YYYY"))
            .replace("*{user}*", name.first_name)
            .replace("*{sheet_id}*", sheet)
            .replace("*{total_questions}*", total);

        return header_text + results.join("\n") +
            `\n\n${ctx.i18n.t("total_corrects")} ${total_corrects} | ${Math.floor(total_corrects / total * 100)} %
            \n${ctx.i18n.t("total_corrects_score")} ${score}`;
    }
}

module.exports = new UserController();