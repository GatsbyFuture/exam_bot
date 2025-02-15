const Markup = require("telegraf/markup");
const CategoriesService = require("./categories.service");

class CategoriesHelpers {
    async polishingCategoryData(text) {
        const titleMatch = text.match(/#title:\s*([^#]+)/);
        const descMatch = text.match(/#desc:\s*([^#]+)/);
        const position = text.match(/#pos:\s*([^#]+)/);
        return {
            title: {
                oz: titleMatch ? titleMatch[1].trim() : null,
                uz: "yes"
            },
            desc: {
                oz: descMatch ? descMatch[1].trim() : null,
                uz: "yes"
            },
            position: position ? +position[1].trim() : null
        };
    }

    async generateCategoriesBtn(lang) {
        const categories = await CategoriesService.getAllCategories();
        // console.log(lang);
        const btns = categories.map(category => {
                return (
                    [Markup.button(`${category.title[lang]} #${category.category_id}`)]
                );
            }
        );
        // console.log(btns);
        return {
            total: btns.length,
            btns: btns
        };
    }
}

module.exports = new CategoriesHelpers();