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

                const {_id, name} = ctx.session.user;

                const updatedLang = await UserControllerCore.updateUserLang(_id, lang);

                if (updatedLang) {
                    ctx.session.user.lang = lang;
                    ctx.i18n.locale(lang);
                }

                ctx.session.user.level = "0";
                // generate users main buttons
                const btns = await UserController.generateUserMarkButtons(ctx, _id);

                await ctx.replyWithHTML(
                    ctx.i18n.t("user_greeting").replace("*{user_name}*", name.first_name),
                    Extra.HTML().markup(Markup.keyboard(btns).resize())
                );

                ctx.deleteMessage();
            } else {
                await next();
            }
        });

        bot.hears(/#\d{10}$/, async (ctx) => {
            const {_id, level, lang} = ctx.session.user;
            const match = ctx.message.text.match(/#(\d{10})$/);
            if (match) {
                ctx.reply(`Topilgan ID: ${match[1]}`); // Faqat raqamni qaytaradi

                if (level === "0.1.x") {
                    await UserControllerCore.sendTestDocument(ctx, +match[1]);
                }

                if (level === "0.1") {
                    ctx.session.user.level = "0.1.x";
                    let {
                        total: total_sheets,
                        btns: sheet_btns
                    } = await UserController.generateUserMarkButtons(ctx, _id, +match[1]);
                    await ctx.replyWithHTML(
                        ctx.i18n.t("user_view_tests_t").replace("*{total}*", total_sheets),
                        Extra.HTML()
                            .markup(
                                Markup.keyboard(
                                    sheet_btns
                                ).resize())
                    );
                }

                // if (level === "0.1.1.2") {
                //     await AdminController.viewTestAnswers(ctx, +match[1], lang);
                // }
            }
        });

        bot.on("text", async (ctx, next) => {
            if (ctx.session.user.role === Roles.USER) {
                let text = ctx.message.text;
                const {_id, level} = ctx.session.user;
                switch (text) {
                    // main menu 0 level
                    case ctx.i18n.t("user_statistics"):
                        ctx.replyWithHTML(ctx.i18n.t("user_statistics_t"));
                        break;
                    case ctx.i18n.t("user_categories"):
                        ctx.session.user.level = "0.1";
                        let {
                            total: total_cats,
                            btns: cat_btns
                        } = await UserController.generateUserMarkButtons(ctx, _id);
                        await ctx.replyWithHTML(
                            ctx.i18n.t("user_categories_t").replace("*{total}*", total_cats),
                            Extra.HTML()
                                .markup(
                                    Markup.keyboard(
                                        cat_btns
                                    ).resize())
                        );
                        break;
                    case ctx.i18n.t("user_random_sheet"):
                        ctx.replyWithHTML(ctx.i18n.t("user_random_sheet_t"));
                        break;
                    case ctx.i18n.t("user_check_answers"):
                        ctx.replyWithHTML(ctx.i18n.t("user_check_answers_t"));
                        break;
                    case ctx.i18n.t("user_settings"):
                        ctx.session.user.level = "0.4";
                        await ctx.replyWithHTML(
                            ctx.i18n.t("user_settings_t"),
                            Extra.HTML()
                                .markup(
                                    Markup.keyboard(
                                        await UserController.generateUserMarkButtons(ctx, _id)
                                    ).resize())
                        );
                        break;
                    //  all categories 0.1 level
                    case ctx.i18n.t("all_categories_t"):
                        ctx.replyWithHTML(ctx.i18n.t("user_all_categories"));
                        break;
                    // //  setttings 0.4 level
                    // case ctx.i18n.t("my_profile"):
                    //     ctx.replyWithHTML(ctx.i18n.t("user_my_profile"));
                    //     break;
                    // case ctx.i18n.t("appeal"):
                    //     ctx.replyWithHTML(ctx.i18n.t("user_appeal"));
                    //     break;
                    // case ctx.i18n.t("my_certificate"):
                    //     ctx.replyWithHTML(ctx.i18n.t("user_my_certificate"));
                    //     break;
                    // case ctx.i18n.t("my_statistics"):
                    //     ctx.replyWithHTML(ctx.i18n.t("user_my_statistics"));
                    //     break;
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
                        ctx.session.user.level = level.includes(".") ?
                            level.substring(0, level.lastIndexOf(".")) :
                            level;

                        const back_btns = await UserController.generateUserMarkButtons(ctx, _id);

                        await ctx.replyWithHTML(
                            ctx.i18n.t("back"),
                            Extra.HTML()
                                .markup(
                                    Markup.keyboard(
                                        back_btns.btns ? back_btns.btns : back_btns
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