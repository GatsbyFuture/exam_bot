const TelegrafI18n = require("telegraf-i18n");
const path = require("path");
const Roles = require("../../core/enums/roles.enum");


const adminI18n = new TelegrafI18n({
    defaultLanguage: "oz",
    useSession: true,
    defaultLanguageOnMissing: true,
    directory: path.resolve(__dirname, "locales"),
});

class AdminMain {
    constructor(bot) {
        bot.use(adminI18n.middleware());

        bot.action(/admin_lang.+/, async (ctx, next) => {
            if (ctx.session.user.role === Roles.ADMIN) {
                const [section, lang] = ctx.match[0].split(".");
                ctx.i18n.locale(lang);

                ctx.deleteMessage();

                const {user_name} = ctx.session.user;

                await ctx.replyWithHTML(ctx.i18n.t("admin_greeting").replace("*{user_name}*", user_name));

                // ctx.session.user.lang = lang;
            } else {
                await next();
            }
        });

        bot.on("text", async (ctx, next) => {
            if (ctx.session.user.role === Roles.ADMIN) {
                let text = ctx.message.text;
                switch (text) {
                    case "/help":
                        ctx.replyWithHTML(ctx.i18n.t("admin_help"));
                        break;
                    default:
                        ctx.replyWithHTML(ctx.i18n.t("admin_default_message"));
                        break;
                }
            } else {
                await next();
            }
        });
    }
}

module.exports = AdminMain;