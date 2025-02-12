// const CategoryService = require("./categories.service");
//
// class CategoriesController extends CategoryService {
//     async createCategory(category, position = undefined) {
//         if (position) {
//             category.position = position;
//         } else {
//             const count = await this.getCountC();
//             category.position = count + 1;
//         }
//         return this.createC(category);
//     }
//
//     async getAllCategories(ctx) {
//         return this.getAllC();
//     }
//
//     async deleteCategory(id) {
//         await this.deleteC(id);
//     }
// }