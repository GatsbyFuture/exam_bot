const TelegrafI18n = require("telegraf-i18n");
const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");
const path = require("path");
const Roles = require("../../enums/roles.enum");

const CoreController = require("../../core/controller/core.controller");
const HelpersCore = require("../../core/helpers/core.helpers");

const UserController = require("./user.controller");
const UserHelpers = require("./user.helpers");

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

                const updatedLang = await CoreController.updateUserLang(_id, lang);

                if (updatedLang) {
                    ctx.session.user.lang = lang;
                    ctx.i18n.locale(lang);
                }

                ctx.session.user.level = "0";
                // generate users main buttons
                const btns = await UserController.generateUserMarkButtons(ctx);

                await ctx.replyWithHTML(
                    ctx.i18n.t("user_greeting").replace("*{user_name}*", name.first_name),
                    Extra.HTML().markup(Markup.keyboard(btns).resize())
                );

                ctx.deleteMessage();
            } else {
                await next();
            }
        });

        bot.action(/compare_test.+/, async (ctx, next) => {
            const {role} = ctx.session.user;
            if (role === Roles.USER) {
                const [section, id] = ctx.match[0].split(".");
                ctx.session.text = `#id:${id}#answers:*{answers}*}`;
                ctx.session.inlineQuery = true;
                ctx.session.user.level = "0.3";

                await UserHelpers.editInlineQuery(ctx);

                let answers = await UserController.generateUserMarkButtons(ctx);
                await ctx.replyWithHTML(
                    ctx.i18n.t("user_check_answers_t_inline"),
                    Extra.HTML()
                        .markup(
                            Markup.keyboard(
                                answers?.btns ? answers.btns : answers
                            ).resize())
                );
            } else {
                await next();
            }
        });

        bot.hears(/#\d{10}$/, async (ctx, next) => {
            const {level, role} = ctx.session.user;
            if (role === Roles.USER) {
                const match = ctx.message.text.match(/#(\d{10})$/);
                if (match) {
                    // ctx.reply(`Topilgan ID: ${match[1]}`); // Faqat raqamni qaytaradi

                    if (level === "0.1.x") {
                        await UserController.ShowSheet(ctx, +match[1]);
                    }

                    if (level === "0.1") {
                        ctx.session.user.level = "0.1.x";
                        let {
                            total: total_sheets,
                            btns: sheet_btns
                        } = await UserController.generateUserMarkButtons(ctx, +match[1]);

                        await ctx.replyWithHTML(
                            ctx.i18n.t("user_view_tests_t").replace("*{total}*", total_sheets),
                            {
                                reply_markup: Markup.keyboard(sheet_btns).resize()
                            }
                        );
                    }
                }
            } else {
                await next();
            }
        });

        bot.on("text", async (ctx, next) => {
            if (ctx.session.user.role === Roles.USER) {
                let text = ctx.message.text;
                const {_id, level, lang} = ctx.session.user;
                // console.log(text, ctx.i18n.t("user_statistics"));
                switch (text) {
                    // main menu 0 level
                    // case ctx.i18n.t("cluster_statistics"):
                    //     const statistics = await UserController.statistics();
                    //     await ctx.replyWithHTML(
                    //         ctx.i18n.t(`cluster_statistics_t`)
                    //             .replace("*{categories}*", statistics.total_categories)
                    //             .replace("*{sheets}*", statistics.total_sheets)
                    //             .replace("*{answers}*", statistics.total_answers)
                    //     );
                    //     break;
                    case ctx.i18n.t("user_statistics"):
                        const userStatistics = await UserController.userStatistics(ctx, _id);

                        await ctx.replyWithHTML(
                            ctx.i18n.t(`user_statistics_t`).concat(userStatistics)
                        );
                        break;
                    case ctx.i18n.t("user_categories"):
                        ctx.session.user.level = "0.1";
                        let {
                            total: total_cats,
                            btns: cat_btns
                        } = await UserController.generateUserMarkButtons(ctx);
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
                        await UserController.sendRandomSheet(ctx, lang);
                        break;
                    case ctx.i18n.t("user_check_answers"):
                        ctx.session.user.level = "0.3";
                        let answers = await UserController.generateUserMarkButtons(ctx);
                        await ctx.replyWithHTML(
                            ctx.i18n.t("user_check_answers_t"),
                            Extra.HTML()
                                .markup(
                                    Markup.keyboard(
                                        answers?.btns ? answers.btns : answers
                                    ).resize())
                        );
                        break;
                    case ctx.i18n.t("user_settings"):
                        ctx.session.user.level = "0.4";
                        await ctx.replyWithHTML(
                            ctx.i18n.t("user_settings_t"),
                            Extra.HTML()
                                .markup(
                                    Markup.keyboard(
                                        await UserController.generateUserMarkButtons(ctx)
                                    ).resize())
                        );
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
                    case ctx.i18n.t("agree"):
                        const compare = await UserController.checkAnswers(ctx, lang);

                        await ctx.replyWithHTML(
                            compare,
                            Extra.HTML()
                                .markup(
                                    Markup.keyboard(
                                        await UserController.generateUserMarkButtons(ctx)
                                    ).resize())
                        );
                        ctx.session.text = undefined;
                        ctx.session.file = undefined;
                        ctx.session.inlineQuery = false;
                        break;
                    case ctx.i18n.t("cancel"):
                        ctx.session.text = undefined;
                        ctx.session.file = undefined;
                        ctx.session.inlineQuery = false;
                        await ctx.replyWithHTML(
                            ctx.i18n.t("user_cancel_decision"),
                            Extra.HTML()
                                .markup(
                                    Markup.keyboard(
                                        await UserController.generateUserMarkButtons(ctx)
                                    ).resize())
                        );
                        break;
                    case ctx.i18n.t("back"):
                        ctx.session.text = undefined;
                        ctx.session.file = undefined;
                        ctx.session.inlineQuery = false;

                        ctx.session.user.level = level.includes(".") ?
                            level.substring(0, level.lastIndexOf(".")) :
                            level;

                        const back_btns = await UserController.generateUserMarkButtons(ctx);

                        await ctx.replyWithHTML(
                            ctx.i18n.t("back"),
                            Extra.HTML()
                                .markup(
                                    Markup.keyboard(
                                        back_btns.btns ? back_btns.btns : back_btns
                                    ).resize())
                        );
                        break;
                    case ctx.i18n.t("user_change_lang"):

                        const placeholder = await ctx.reply("...", {
                            reply_markup: {remove_keyboard: true},
                        });

                        await ctx.telegram.deleteMessage(
                            placeholder.chat.id,
                            placeholder.message_id
                        );

                        HelpersCore.langs(ctx);
                        break;
                    default:
                        switch (level) {
                            case "0.3":
                                if (ctx.session.inlineQuery) {
                                    ctx.session.text = ctx.session.text.replace("*{answers}*", text);
                                } else {
                                    ctx.session.text = text;
                                }
                                await ctx.replyWithHTML(
                                    ctx.i18n.t("user_this_is_right_sure"),
                                    Extra.HTML()
                                        .markup(
                                            Markup.keyboard(
                                                await CoreController.generateAgreeButton(ctx)
                                            ).resize())
                                );
                                break;
                            default:
                                if (!ctx.session.__language_code && lang !== "oz") {
                                    ctx.replyWithHTML(ctx.i18n.t("default_message"));
                                    ctx.i18n.locale(lang);
                                    break;
                                }
                                ctx.replyWithHTML(ctx.i18n.t("user_default_message"));
                                break;
                        }
                }
            } else {
                await next();
            }
        });
    }
}

module.exports = UserMain;