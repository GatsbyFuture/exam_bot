const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");
const Collections = require("../enums/collections.enum");
const CategoriesHelpers = require("../../modules/categories/categories.helpers");

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
            buttons.push([Markup.button(ctx.i18n.t("back"))]);
        }

        return buttons;
    }

    async generateMarkupBtnAgree(ctx) {
        return [
            [Markup.button(ctx.i18n.t("agree"))],
            [Markup.button(ctx.i18n.t("cancel"))]
        ];
    }

    async generateMarkupButtonsDynamic(ctx, lang, btn_keys) {
        if (btn_keys["collection"] === Collections.CATEGORIES) {
            let buttons = await CategoriesHelpers.generateCategoriesBtn(lang);

            buttons.btns.push([Markup.button(ctx.i18n.t("back"))]);

            return buttons;
        }
    }
}

module.exports = new HelpersCore();