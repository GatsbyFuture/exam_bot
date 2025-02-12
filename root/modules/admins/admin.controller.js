const AdminService = require("./admin.service");
const CategoriesService = require("../categories/categories.service");
const HelpersCore = require("../../core/helpers/helpers.core");
const AdminHelpers = require("./admin.helpers");
const btnMethods = require("../../core/enums/btn.method.enum");
const config = require("./admin.config");

class AdminController extends AdminService {
    async generateUserMarkButtons(ctx, data) {
        const [_id, level] = data;

        await this.updateLevel(_id, level);

        const btn_keys = config.MARKUP_BUTTONS_LIST[level];

        if (Array.isArray(btn_keys)) {
            return await HelpersCore.generateMarkupButtons(ctx, btn_keys, level);
        } else {
            // get data from db and generate buttons
            if (btn_keys["method"] === btnMethods.CREATE) {
                return await HelpersCore.generateMarkupButtons(ctx, [], level);
            }
        }
    }

    async generateAgreeButton(ctx) {
        return HelpersCore.generateMarkupBtnAgree(ctx);
    }

    async createCategory(ctx, text, level) {
        const {method, collaction} = config.MARKUP_BUTTONS_LIST[level];

        const data = await AdminHelpers.polishingCategoryData(text);

    }
}

module.exports = new AdminController();