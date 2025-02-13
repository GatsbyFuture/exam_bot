const CustomError = require("../../core/errors/custom.error");
const AdminService = require("./admin.service");
const AdminHelpers = require("./admin.helpers");

const HelpersCore = require("../../core/helpers/helpers.core");

const CategoriesService = require("../categories/categories.service");
const CategoriesHelpers = require("../categories/categories.helpers");
const {createCategorySchema} = require("../categories/categories.dto");

const btnMethods = require("../../core/enums/btn.method.enum");
const config = require("./admin.config");
const {toCyrillic} = require("../../libs/libs.latin.to.cyril");


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
        const data = await CategoriesHelpers.polishingCategoryData(text);
        const {error} = createCategorySchema.validate(data);

        if (error) {
            throw CustomError.InCorrectDtoError(ctx.i18n.t(`${level}_dto_error`));
        }
        data.title.uz = toCyrillic(data.title.oz);
        data.desc.uz = toCyrillic(data.desc.oz);

        const newCategory = await CategoriesService.createC(data);

        return newCategory.category_id;
    }
}

module.exports = new AdminController();