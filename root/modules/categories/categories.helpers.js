const Markup = require("telegraf/markup");
const CategoriesService = require("./categories.service");

class CategoriesHelpers {
    async polishingCategoryData(text) {
        // #title: yoki #title : uchun
        const titleMatch = text.match(/#title\s*:([^#]+)/);
        // #desc: yoki #desc : uchun
        const descMatch = text.match(/#desc\s*:([^#]+)/);
        // #pos: yoki #pos : uchun
        const positionMatch = text.match(/#pos\s*:([^#]+)/);
        return {
            title: {
                oz: titleMatch ? titleMatch[1].trim() : null,
                uz: "yes"
            },
            desc: {
                oz: descMatch ? descMatch[1].trim() : "yes",
                uz: "yes"
            },
            position: positionMatch ? +positionMatch[1].trim() : null
        };
    }

    async generateCategoriesBtn(categories, lang) {
        // console.log(categories);
        const btns = categories.map(category => {
                return (
                    [Markup.button(`${category.title[lang]} #${category.category_id}`)]
                );
            }
        );

        return {
            total: btns.length,
            btns: btns
        };
    }
}

module.exports = new CategoriesHelpers();