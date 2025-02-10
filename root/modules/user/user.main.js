const TelegrafI18n = require("telegraf-i18n");
const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");
const path = require("path");
const Roles = require("../../core/enums/roles.enum");
const UserControllerCore = require("../../core/controller/user.controller.core");
const UserController = require("./user.controller");

const userI18n = new TelegrafI18n({
    defaultLanguage: "oz",
    useSession: true,
    defaultLanguageOnMissing: true,
    directory: path.resolve(__dirname, "locales"),
});

class UserMain {
    constructor(bot) {
        bot.use(userI18n.middleware());

        bot.action(/user_lang.+/, async (ctx, next) => {
            if (ctx.session.user.role === Roles.USER) {
                const [section, lang] = ctx.match[0].split(".");

                const {_id, user_name} = ctx.session.user;

                const updatedLang = await UserControllerCore.updateUserLang(_id, lang);

                if (updatedLang) {
                    ctx.session.user.lang = lang;
                    ctx.i18n.locale(lang);
                }

                // generate user main buttons
                const btns = await UserController.generateUserButtons(ctx, [_id, "0"]);

                console.log(btns);

                await ctx.replyWithHTML(
                    ctx.i18n.t("user_greeting").replace("*{user_name}*", user_name),
                    Extra.HTML().markup(Markup.keyboard(btns).resize())
                );

                ctx.deleteMessage();
            } else {
                await next();
            }
        });

        bot.on("text", async (ctx, next) => {
            if (ctx.session.user.role === Roles.USER) {
                let text = ctx.message.text;
                switch (text) {
                    case "/help":
                        ctx.replyWithHTML(ctx.i18n.t("user_help"));
                        break;
                    default:
                        ctx.replyWithHTML(ctx.i18n.t("user_default_message"));
                        break;
                }
            } else {
                await next();
            }
        });
    }
}

module.exports = UserMain;