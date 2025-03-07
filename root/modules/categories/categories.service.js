const Category = require("./categories.model");
const CustomError = require("../../errors/custom.error");

class CategoriesService {
    async createCategory(category) {
        if (!category.position) {
            const count = await this.getCountCategories();
            category.position = count + 1;
        }

        const newCategory = await Category.create(category);

        return newCategory.category_id;
    }

    async getAllCategories() {
        return Category.find({}).sort({position: 1}).lean();
    }

    async getByIdCategory(id) {
        return Category.findById(id).lean();
    }

    async getCountCategories() {
        return Category.countDocuments();
    }

    async updateCategory(id, data) {
        const updated = await Category.findByIdAndUpdate(
            id,
            data,
            {new: true}
        ).lean();

        if (!updated) {
            throw CustomError.CategoryNotFoundError();
        }
    }

    async deleteCategory(id) {
        const deleted = await Category.deleteOne({
            category_id: id
        });

        if (deleted.deletedCount === 0) {
            throw CustomError.CategoryNotFoundError();
        }
    }
}

module.exports = CategoriesService;