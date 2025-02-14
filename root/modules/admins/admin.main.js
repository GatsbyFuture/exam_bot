const TelegrafI18n = require("telegraf-i18n");
const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");
const path = require("path");
const Roles = require("../../core/enums/roles.enum");
const UserControllerCore = require("../../core/controller/user.controller.core");
const AdminController = require("./admin.controller");
const UserController = require("../users/user.controller");
const config = require("./admin.config");
const btnMethods = require("../../core/enums/btn.method.enum");

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

                const {_id, user_name} = ctx.session.user;

                const updatedLang = await UserControllerCore.updateUserLang(_id, lang);

                if (updatedLang) {
                    ctx.session.user.lang = lang;
                    ctx.i18n.locale(lang);
                }

                // generate admin main buttons
                const btns = await AdminController.generateUserMarkButtons(ctx, [_id, "0"]);

                await ctx.replyWithHTML(
                    ctx.i18n.t("user_greeting").replace("*{user_name}*", user_name),
                    Extra.HTML().markup(Markup.keyboard(btns).resize())
                );

                ctx.deleteMessage();
            } else {
                await next();
            }
        });

        bot.on("photo", async (ctx) => {
            const {file_id} = ctx.message.photo[ctx.message.photo.length - 1];
            const file = await ctx.telegram.getFile(file_id);

            ctx.session.file = file;
        });

        bot.on("text", async (ctx, next) => {
            if (ctx.session.user.role === Roles.ADMIN) {
                let text = ctx.message.text;
                const {_id, level} = ctx.session.user;
                switch (text) {
                    // 0.0
                    case ctx.i18n.t("statistics"):
                        ctx.replyWithHTML(ctx.i18n.t("admin_statistics"));
                        break;
                    // 0.1
                    case ctx.i18n.t("tests"):
                        ctx.session.user.level = "0.1";
                        await ctx.replyWithHTML(
                            ctx.i18n.t("create_and_view_test_btn"),
                            Extra.HTML()
                                .markup(
                                    Markup.keyboard(
                                        await AdminController.generateUserMarkButtons(ctx, [_id, "0.1"])
                                    ).resize())
                        );
                        break;
                    case ctx.i18n.t("create"):
                        ctx.session.user.level = "0.1.0";
                        await ctx.replyWithHTML(
                            ctx.i18n.t("create_cat_test_answer_btn"),
                            Extra.HTML()
                                .markup(
                                    Markup.keyboard(
                                        await AdminController.generateUserMarkButtons(ctx, [_id, "0.1.0"])
                                    ).resize())
                        );
                        break;
                    //  0.1.0
                    case ctx.i18n.t("category"):
                        ctx.session.user.level = "0.1.0.0";
                        await ctx.replyWithHTML(
                            ctx.i18n.t("create_category"),
                            Extra.HTML()
                                .markup(
                                    Markup.keyboard(
                                        await AdminController.generateUserMarkButtons(ctx, [_id, "0.1.0.0"])
                                    ).resize())
                        );
                        break;
                    case ctx.i18n.t("test"):
                        ctx.session.user.level = "0.1.0.1";
                        await ctx.replyWithHTML(
                            ctx.i18n.t("create_test"),
                            Extra.HTML()
                                .markup(
                                    Markup.keyboard(
                                        await AdminController.generateUserMarkButtons(ctx, [_id, "0.1.0.1"])
                                    ).resize())
                        );
                        break;
                    case ctx.i18n.t("answer"):
                        ctx.session.user.level = "0.1.0.2";
                        await ctx.replyWithHTML(
                            ctx.i18n.t("create_answer"),
                            Extra.HTML()
                                .markup(
                                    Markup.keyboard(
                                        await AdminController.generateUserMarkButtons(ctx, [_id, "0.1.0.2"])
                                    ).resize())
                        );
                        break;
                    case ctx.i18n.t("view"):
                        ctx.session.user.level = "0.1.1";
                        await ctx.replyWithHTML(
                            ctx.i18n.t("create_cat_test_answer_btn"),
                            Extra.HTML()
                                .markup(
                                    Markup.keyboard(
                                        await AdminController.generateUserMarkButtons(ctx, [_id, "0.1.1"])
                                    ).resize())
                        );
                        break;
                    //  0.1.1
                    case ctx.i18n.t("categories"):
                        ctx.session.user.level = "0.1.1.0";
                        let {
                            total: total_cats,
                            btns: cat_btns
                        } = await AdminController.generateUserMarkButtons(ctx, [_id, "0.1.1.0"]);
                        await ctx.replyWithHTML(
                            ctx.i18n.t("view_categories").replace("*{total}*", total_cats),
                            Extra.HTML()
                                .markup(
                                    Markup.keyboard(
                                        cat_btns
                                    ).resize())
                        );
                        break;
                    case ctx.i18n.t("read_tests"):
                        ctx.session.user.level = "0.1.1.1";
                        let {
                            total: total_sheets,
                            btns: sheet_btns
                        } = await AdminController.generateUserMarkButtons(ctx, [_id, "0.1.1.1"]);
                        await ctx.replyWithHTML(
                            ctx.i18n.t("read_tests").replace("*{total}*", total_sheets),
                            Extra.HTML()
                                .markup(
                                    Markup.keyboard(
                                        sheet_btns
                                    ).resize())
                        );
                        break;
                    case ctx.i18n.t("answers"):
                        // ctx.session.user.level = "0.1.1.2";
                        // await ctx.replyWithHTML(
                        //     ctx.i18n.t("create_answer"),
                        //     Extra.HTML()
                        //         .markup(
                        //             Markup.keyboard(
                        //                 await AdminController.generateUserMarkButtons(ctx, [_id, "0.1.1.2"])
                        //             ).resize())
                        // );
                        break;
                    // // 0.2
                    // case ctx.i18n.t("settings"):
                    //     ctx.replyWithHTML(ctx.i18n.t("settings"));
                    //     break;
                    case ctx.i18n.t("back"):
                        let decrease_level = level === "0" ? level : level.substring(0, level.lastIndexOf("."));
                        ctx.session.user.level = decrease_level;
                        await ctx.replyWithHTML(
                            ctx.i18n.t("back"),
                            Extra.HTML()
                                .markup(
                                    Markup.keyboard(
                                        await AdminController.generateUserMarkButtons(
                                            ctx,
                                            [_id, decrease_level]
                                        )
                                    ).resize())
                        );
                        break;
                    case ctx.i18n.t("agree"):
                        const {key, id} = await AdminController.createData(
                            ctx,
                            level
                        );
                        await ctx.replyWithHTML(
                            ctx.i18n.t(`${level}_created`)
                                .replace(key, id),
                            Extra.HTML()
                                .markup(
                                    Markup.keyboard(
                                        await AdminController.generateUserMarkButtons(ctx, [_id, level])
                                    ).resize())
                        );
                        ctx.session.text = undefined;
                        ctx.session.file = undefined;
                        break;
                    case ctx.i18n.t("cancel"):
                        ctx.session.text = undefined;
                        ctx.session.file = undefined;
                        await ctx.replyWithHTML(
                            ctx.i18n.t(`${level}_canceled`),
                            Extra.HTML()
                                .markup(
                                    Markup.keyboard(
                                        await AdminController.generateUserMarkButtons(ctx, [_id, level])
                                    ).resize())
                        );
                        break;
                    default:
                        switch (level) {
                            case "0.1.0.0":
                                ctx.session.text = text;
                                await ctx.replyWithHTML(
                                    ctx.i18n.t("this_is_right_you_sure"),
                                    Extra.HTML()
                                        .markup(
                                            Markup.keyboard(
                                                await AdminController.generateAgreeButton(ctx)
                                            ).resize())
                                );
                                break;
                            case "0.1.0.1":
                                ctx.session.text = text;
                                if (ctx.session?.file && text) {
                                    await ctx.replyWithHTML(
                                        ctx.i18n.t("this_is_right_you_sure"),
                                        Extra.HTML()
                                            .markup(
                                                Markup.keyboard(
                                                    await AdminController.generateAgreeButton(ctx)
                                                ).resize())
                                    );
                                }
                                break;
                            case "0.1.0.2":
                            default:
                                ctx.replyWithHTML(ctx.i18n.t("admin_default_message"));
                                break;
                        }
                    // ctx.replyWithHTML(ctx.i18n.t("admin_default_message"));
                    // break;
                }
            } else {
                await next();
            }
        });
    }
}

module.exports = AdminMain;