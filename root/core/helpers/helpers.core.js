const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");

module.exports = class HelpersCore {
    static langs(ctx) {
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
};