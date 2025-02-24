const {toCyrillic} = require("../../libs/libs.latin.to.cyril");
const CustomError = require("../../core/errors/custom.error");

const {createCategorySchema} = require("./categories.dto");
const CategoriesHelpers = require("./categories.helpers");
const CategoriesService = require("./categories.service");

class CategoriesController extends CategoriesService {
    async generateMarkupButtonsDynamic(back, lang) {
        const categories = await this.getAllCategories();

        let buttons = await CategoriesHelpers.generateCategoriesBtn(categories, lang);

        buttons.btns.push([back]);

        return buttons;
    }

    async create(text) {

        const data = await CategoriesHelpers.polishingCategoryData(text);

        const {error} = createCategorySchema.validate(data);

        if (error) {
            throw CustomError.InCorrectDtoError();
        }

        data.title.uz = toCyrillic(data.title.oz);
        data.desc.uz = toCyrillic(data.desc.oz);

        const newCategory = await this.createCategory(data);

        return {
            key: "category", // detect for which collection...
            id: newCategory.category_id
        };
    }
}

module.exports = new CategoriesController();