const CustomError = require("../../core/errors/custom.error");
const AdminService = require("./admin.service");
const AdminHelpers = require("./admin.helpers");

const HelpersCore = require("../../core/helpers/helpers.core");

const CategoriesService = require("../categories/categories.service");
const CategoriesHelpers = require("../categories/categories.helpers");
const {createCategorySchema} = require("../categories/categories.dto");

const SheetsService = require("../sheets/sheets.service");
const SheetsHelpers = require("../sheets/sheets.helpers");
const {createSheetSchema} = require("../sheets/sheets.dto");

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

            const newCategory = await CategoriesService.createCategory(data);

            return {
                key: "category", // detect for which collection...
                id: newCategory.category_id
            };
        }
        if (btn_keys["collection"] === Collections.SHEETS) {
            // code for creating test
            const {text, file} = ctx.session;
            console.log(text, file);

            const data = await SheetsHelpers.polishingSheetData(text);
            const {error} = createSheetSchema.validate(data);

            if (error) {
                throw CustomError.InCorrectDtoError(ctx.i18n.t(`${level}_dto_error`));
            }

            const {success, file_path} = await SheetsHelpers.createSheetDocument(file);

            if (!success) {
                throw CustomError.SaveDocumentsError(ctx.i18n.t(`${level}_error`));
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
    }
}

module.exports = new AdminController();





