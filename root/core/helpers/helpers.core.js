const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");
const Collections = require("../enums/collections.enum");
const CategoriesHelpers = require("../../modules/categories/categories.helpers");
const SheetsHelpers = require("../../modules/sheets/sheets.helpers");
const AnswersHelpers = require("../../modules/answers/answers.helpers");

class HelpersCore {
    langs(ctx) {
        const role = ctx.session.user.role;

        let btns = [
            [Markup.callbackButton("🇺🇿 O'zbekcha", `${role}_lang.oz`)],
            [Markup.callbackButton("🇺🇿 Ўзбекча", `${role}_lang.uz`)],
        ];

        ctx.replyWithHTML(
            ctx.i18n.t("core_lang"),
            Extra.HTML().markup(Markup.inlineKeyboard(btns))
        );
    }

    async generateMarkupButtons(ctx, btn_keys, level) {
        let groupedButtons = btn_keys.reduce((acc, btn) => {
            acc[btn.position] = acc[btn.position] || [];
            acc[btn.position].push(Markup.button(ctx.i18n.t(btn.name)));
            return acc;
        }, {});

        let buttons = Object.values(groupedButtons);

        if (level !== "0") {
            buttons.push([Markup.button(ctx.i18n.t("admin_back"))]);
        }

        return buttons;
    }

    async generateMarkupBtnAgree(ctx) {
        return [
            [Markup.button(ctx.i18n.t("admin_agree"))],
            [Markup.button(ctx.i18n.t("admin_cancel"))]
        ];
    }

    async generateMarkupButtonsDynamic(ctx, lang, btn_keys, cat_id) {
        if (btn_keys["collection"] === Collections.CATEGORIES) {
            // console.log(btn_keys);
            let buttons = await CategoriesHelpers.generateCategoriesBtn(lang);

            buttons.btns.push([Markup.button(ctx.i18n.t("admin_back"))]);
            // console.log("__", buttons);
            return buttons;
        }

        if (btn_keys["collection"] === Collections.SHEETS) {
            const query = {
                is_public: true,
                is_active: true
            };

            if (cat_id) {
                query.category_id = cat_id;
            }

            let buttons = await SheetsHelpers.generateSheetBtn(lang, query);

            buttons.btns.push([Markup.button(ctx.i18n.t("admin_back"))]);

            return buttons;
        }

        if (btn_keys["collection"] === Collections.ANSWER) {
            let buttons = await AnswersHelpers.generateAnswersBtn(lang);

            buttons.btns.push([Markup.button(ctx.i18n.t("admin_back"))]);

            return buttons;
        }
    }
}

module.exports = new HelpersCore();