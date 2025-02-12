const TelegrafI18n = require("telegraf-i18n");
const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");
const path = require("path");
const Roles = require("../../core/enums/roles.enum");
const UserControllerCore = require("../../core/controller/user.controller.core");
const UserController = require("./user.controller");
const HelpersCore = require("../../core/helpers/helpers.core");

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

                // generate users main buttons
                const btns = await UserController.generateUserMarkButtons(ctx, [_id, "0"]);

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
                const {_id, level} = ctx.session.user;
                switch (text) {
                    // main menu 0 level
                    case ctx.i18n.t("statistics"):
                        ctx.replyWithHTML(ctx.i18n.t("user_statistics"));
                        break;
                    case ctx.i18n.t("by_category"):
                        ctx.replyWithHTML(ctx.i18n.t("user_by_category"));
                        break;
                    case ctx.i18n.t("random_test"):
                        ctx.replyWithHTML(ctx.i18n.t("user_random_test"));
                        break;
                    case ctx.i18n.t("check_answers"):
                        ctx.replyWithHTML(ctx.i18n.t("user_check_answers"));
                        break;
                    case ctx.i18n.t("settings"):
                        ctx.session.user.level = "0.4";
                        await ctx.replyWithHTML(
                            ctx.i18n.t("user_settings"),
                            Extra.HTML()
                                .markup(
                                    Markup.keyboard(
                                        await UserController.generateUserMarkButtons(ctx, [_id, "0.4"])
                                    ).resize())
                        );
                        break;
                    //  all categories 0.1 level
                    case ctx.i18n.t("all_categories"):
                        ctx.replyWithHTML(ctx.i18n.t("user_all_categories"));
                        break;
                    //  setttings 0.4 level
                    case ctx.i18n.t("my_profile"):
                        ctx.replyWithHTML(ctx.i18n.t("user_my_profile"));
                        break;
                    case ctx.i18n.t("appeal"):
                        ctx.replyWithHTML(ctx.i18n.t("user_appeal"));
                        break;
                    case ctx.i18n.t("my_certificate"):
                        ctx.replyWithHTML(ctx.i18n.t("user_my_certificate"));
                        break;
                    case ctx.i18n.t("my_statistics"):
                        ctx.replyWithHTML(ctx.i18n.t("user_my_statistics"));
                        break;
                    case ctx.i18n.t("lang"):
                        ctx.replyWithHTML(ctx.i18n.t("user_lang"));

                        const placeholder = await ctx.reply("...", {
                            reply_markup: {remove_keyboard: true},
                        });

                        await ctx.telegram.deleteMessage(
                            placeholder.chat.id,
                            placeholder.message_id
                        );

                        HelpersCore.langs(ctx);

                        break;
                    case ctx.i18n.t("back"):
                        let decrease_level = level.includes(".") ?
                            level.substring(0, level.lastIndexOf(".")) :
                            level;

                        await ctx.replyWithHTML(
                            ctx.i18n.t("back"),
                            Extra.HTML()
                                .markup(
                                    Markup.keyboard(
                                        await UserController.generateUserMarkButtons(
                                            ctx,
                                            [_id, decrease_level]
                                        )
                                    ).resize())
                        );
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