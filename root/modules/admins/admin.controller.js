const CustomError = require("../../core/errors/custom.error");
const AdminService = require("./admin.service");
const AdminHelpers = require("./admin.helpers");

const HelpersCore = require("../../core/helpers/helpers.core");

const CategoriesService = require("../categories/categories.service");
const CategoriesHelpers = require("../categories/categories.helpers");
const {createCategorySchema} = require("../categories/categories.dto");

const BtnMethods = require("../../core/enums/btn.method.enum");
const Collections = require("../../core/enums/collections.enum");
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
            if (btn_keys["method"] === BtnMethods.READ) {
                return await HelpersCore.generateMarkupButtonsDynamic(
                    ctx,
                    ctx.session.user.lang,
                    btn_keys
                );
            } else if (btn_keys["method"] === BtnMethods.UPDATE) {

            } else if (btn_keys["method"] === BtnMethods.CREATE) {
                return await HelpersCore.generateMarkupButtons(ctx, [], level);
            }
        }
    }

    async generateAgreeButton(ctx) {
        return HelpersCore.generateMarkupBtnAgree(ctx);
    }

    async createData(ctx, level) {
        const btn_keys = config.MARKUP_BUTTONS_LIST[level];

        if (btn_keys["collection"] === Collections.CATEGORIES) {
            const text = ctx.message.text;
            const data = await CategoriesHelpers.polishingCategoryData(text);
            const {error} = createCategorySchema.validate(data);

            if (error) {
                throw CustomError.InCorrectDtoError(ctx.i18n.t(`${level}_dto_error`));
            }
            data.title.uz = toCyrillic(data.title.oz);
            data.desc.uz = toCyrillic(data.desc.oz);

            const newCategory = await CategoriesService.createC(data);

            return {
                key: "category", // detect for which collection...
                id: newCategory.category_id
            };
        }
        if (btn_keys["collection"] === Collections.TESTS) {
            // code for creating test
        }
    }
}

module.exports = new AdminController();