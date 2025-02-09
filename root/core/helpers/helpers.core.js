const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");

module.exports = class HelpersCore {
    static langs(ctx) {
        let btns = [
            [Markup.callbackButton("🇺🇿 O'zbekcha", `lang.oz`)],
            [Markup.callbackButton("🇺🇿 Ўзбекча", `lang.uz`)],
        ];

        ctx.replyWithHTML(
            ctx.i18n.t("core_lang"),
            Extra.HTML().markup(Markup.inlineKeyboard(btns))
        );
    }
};