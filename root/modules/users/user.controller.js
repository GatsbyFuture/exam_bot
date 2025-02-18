const UserService = require("./user.service");
const HelpersCore = require("../../core/helpers/helpers.core");
const BtnMethods = require("../../core/enums/btn.method.enum");
const config = require("./user.config");
const CategoriesService = require("../categories/categories.service");
const SheetsService = require("../sheets/sheets.service");
const AnswersService = require("../answers/answers.service");

class UserController extends UserService {
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

    async generateUserMarkButtons(ctx, _id, cat_id = 0) {
        const {level, lang} = ctx.session.user;

        await this.updateLevel(_id, level);

        const btn_keys = config.MARKUP_BUTTONS_LIST[level];

        if (Array.isArray(btn_keys)) {
            return await HelpersCore.generateMarkupButtons(ctx, btn_keys, level);
        } else {
            // get data from db and generate buttons
            if (btn_keys["method"] === BtnMethods.READ) {
                return await HelpersCore.generateMarkupButtonsDynamic(
                    ctx,
                    lang,
                    btn_keys,
                    cat_id
                );
            }
        }
    }
}

module.exports = new UserController();