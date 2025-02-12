const Category = require("./categories.model");
const CustomError = require("../../core/errors/custom.error");

class CategoriesService {
    async createC(category, position = undefined) {
        if (position) {
            category.position = position;
        } else {
            const count = await this.getCountC();
            category.position = count + 1;
        }
        return Category.create(category);
    }

    async getAllC() {
        return Category.find({
            is_public: true,
            is_active: true
        }).sort({position: 1}).lean();
    }

    async getByIdC(id) {
        return Category.findById(id).lean();
    }

    async getCountC() {
        return Category.countDocuments();
    }

    async updateC(id, data) {
        const updated = await Category.findByIdAndUpdate(
            id,
            data,
            {new: true}
        ).lean();

        if (!updated) {
            throw CustomError.CategoryNotFoundError();
        }
    }

    async deleteC(id) {
        const deleted = await Category.findByIdAndDelete(id).lean();

        if (!deleted) {
            throw CustomError.CategoryNotFoundError();
        }
    }
}

module.exports = new CategoriesService();