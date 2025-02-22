const TelegrafI18n = require("telegraf-i18n");
const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");
const path = require("path");
const Roles = require("../../core/enums/roles.enum");
const UserControllerCore = require("../../core/controller/user.controller.core");
const AdminController = require("./admin.controller");
const BtnMethods = require("../../core/enums/btn.method.enum");
const UserController = require("../users/user.controller");
const config = require("./admin.config");
const btnMethods = require("../../core/enums/btn.method.enum");
const fileTypesTgEnum = require("../../core/enums/file.types.tg.enum");
const fileTypesEnum = require("../../core/enums/file.types.enum");

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

                const {_id, name} = ctx.session.user;

                const updatedLang = await UserControllerCore.updateUserLang(_id, lang);

                if (updatedLang) {
                    ctx.session.user.lang = lang;
                    ctx.i18n.locale(lang);
                }

                // generate admin main buttons
                const btns = await AdminController.generateAdminMarkButtons(ctx, [_id, "0"]);

                await ctx.replyWithHTML(ctx.i18n.t("admin_greeting").replace("*{user_name}*", name.first_name), Extra.HTML().markup(Markup.keyboard(btns).resize()));

                ctx.deleteMessage();
            } else {
                await next();
            }
        });

        bot.on("document", async (ctx, next) => {
            if (ctx.session.user.role === Roles.ADMIN) {
                const document = ctx.message.document;

                const file = await ctx.telegram.getFile(document.file_id);

                ctx.session.file = file;

                if (fileTypesTgEnum.PDF.includes(document.mime_type)) {
                    ctx.session.file_type = fileTypesEnum.PDF.key;
                }

                if (fileTypesTgEnum.PHOTO.includes(document.mime_type)) {
                    ctx.session.file_type = fileTypesEnum.PHOTO.key;
                }

                if (fileTypesTgEnum.EXCEL.includes(document.mime_type)) {
                    ctx.session.file_type = fileTypesEnum.EXCEL.key;
                    ctx.session.file_name = document.file_name;
                }

                if (fileTypesTgEnum.DOC.includes(document.mime_type)) {
                    ctx.session.file_type = fileTypesEnum.DOC.key;
                }

            } else {
                await next();
            }
        });

        bot.on("photo", async (ctx, next) => {
            if (ctx.session.user.role === Roles.ADMIN) {
                const {file_id} = ctx.message.photo[ctx.message.photo.length - 1];
                const file = await ctx.telegram.getFile(file_id);

                ctx.session.file = file;
                ctx.session.file_type = fileTypesEnum.PHOTO.key;
            } else {
                await next();
            }
        });

        bot.hears(/#\d{10}$/, async (ctx, next) => {
            const {_id, level, lang, role} = ctx.session.user;
            if (role === Roles.ADMIN) {
                const match = ctx.message.text.match(/#(\d{10})$/);
                if (match) {
                    ctx.reply(`Foydalanilgan ID: ${match[1]}`); // Faqat raqamni qaytaradi

                    if (level === "0.1.1.1" || level === "0.1.1.0.x") {
                        await UserControllerCore.sendTestDocument(ctx, +match[1]);
                    }
                    // console.log("level =>", level);
                    if (level === "0.1.1.0") {
                        ctx.session.user.level = "0.1.1.0.x";
                        let {
                            total: total_sheets, btns: sheet_btns
                        } = await AdminController.generateAdminMarkButtons(ctx, [_id, "0.1.1.0.x"], +match[1]);
                        await ctx.replyWithHTML(ctx.i18n.t("admin_view_tests_show").replace("*{total}*", total_sheets), Extra.HTML()
                            .markup(Markup.keyboard(sheet_btns).resize()));
                    }

                    if (level === "0.1.1.2") {
                        await AdminController.viewTestAnswers(ctx, +match[1], lang);
                    }
                }
            } else {
                await next();
            }
        });

        bot.on("text", async (ctx, next) => {
            if (ctx.session.user.role === Roles.ADMIN) {
                let text = ctx.message.text;
                const {_id, level} = ctx.session.user;
                switch (text) {
                    // 0.0
                    case ctx.i18n.t("admin_statistics"):
                        const statistics = await AdminController.statistics();
                        await ctx.replyWithHTML(ctx.i18n.t(`admin_statistics_t`)
                            .replace("*{categories}*", statistics.total_categories)
                            .replace("*{sheets}*", statistics.total_sheets)
                            .replace("*{answers}*", statistics.total_answers));
                        break;
                    // 0.1
                    case ctx.i18n.t("admin_data"):
                        ctx.session.user.level = "0.1";
                        await ctx.replyWithHTML(ctx.i18n.t("admin_view_btn_text"), Extra.HTML()
                            .markup(Markup.keyboard(await AdminController.generateAdminMarkButtons(ctx, [_id, "0.1"])).resize()));
                        break;
                    case ctx.i18n.t("admin_create"):
                        ctx.session.user.level = "0.1.0";
                        await ctx.replyWithHTML(ctx.i18n.t("admin_cat_she_ans"), Extra.HTML()
                            .markup(Markup.keyboard(await AdminController.generateAdminMarkButtons(ctx, [_id, "0.1.0"])).resize()));
                        break;
                    //  0.1.0
                    case ctx.i18n.t("admin_create_category"):
                        ctx.session.user.level = "0.1.0.0";
                        await ctx.replyWithHTML(ctx.i18n.t("admin_create_cat_text"), Extra.HTML()
                            .markup(Markup.keyboard(await AdminController.generateAdminMarkButtons(ctx, [_id, "0.1.0.0"])).resize()));
                        break;
                    case ctx.i18n.t("admin_create_sheet"):
                        ctx.session.user.level = "0.1.0.1";
                        await ctx.replyWithHTML(ctx.i18n.t("admin_create_she_text"), Extra.HTML()
                            .markup(Markup.keyboard(await AdminController.generateAdminMarkButtons(ctx, [_id, "0.1.0.1"])).resize()));
                        break;
                    case ctx.i18n.t("admin_create_answer"):
                        ctx.session.user.level = "0.1.0.2";
                        await ctx.replyWithHTML(ctx.i18n.t("admin_create_ans_text"), Extra.HTML()
                            .markup(Markup.keyboard(await AdminController.generateAdminMarkButtons(ctx, [_id, "0.1.0.2"])).resize()));
                        break;
                    case ctx.i18n.t("admin_view"):
                        ctx.session.user.level = "0.1.1";
                        await ctx.replyWithHTML(ctx.i18n.t("admin_view_cat_she_ans"), Extra.HTML()
                            .markup(Markup.keyboard(await AdminController.generateAdminMarkButtons(ctx, [_id, "0.1.1"])).resize()));
                        break;
                    //  0.1.1
                    case ctx.i18n.t("admin_view_categories"):
                        ctx.session.user.level = "0.1.1.0";
                        let {
                            total: total_cats, btns: cat_btns
                        } = await AdminController.generateAdminMarkButtons(ctx, [_id, "0.1.1.0"]);
                        await ctx.replyWithHTML(ctx.i18n.t("admin_view_cats_show").replace("*{total}*", total_cats), Extra.HTML()
                            .markup(Markup.keyboard(cat_btns).resize()));
                        break;
                    case ctx.i18n.t("admin_view_sheets"):
                        ctx.session.user.level = "0.1.1.1";
                        let {
                            total: total_sheets, btns: sheet_btns
                        } = await AdminController.generateAdminMarkButtons(ctx, [_id, "0.1.1.1"]);
                        await ctx.replyWithHTML(ctx.i18n.t("admin_view_tests_show").replace("*{total}*", total_sheets), Extra.HTML()
                            .markup(Markup.keyboard(sheet_btns).resize()));
                        break;
                    case ctx.i18n.t("admin_view_answers"):
                        ctx.session.user.level = "0.1.1.2";
                        let {
                            total: total_answers, btns: answer_btns
                        } = await AdminController.generateAdminMarkButtons(ctx, [_id, "0.1.1.2"]);
                        await ctx.replyWithHTML(ctx.i18n.t("admin_view_answers_show").replace("*{total}*", total_answers), Extra.HTML()
                            .markup(Markup.keyboard(answer_btns).resize()));
                        break;
                    // // 0.2
                    case ctx.i18n.t("admin_settings"):
                        ctx.session.user.level = "0.2";
                        await ctx.replyWithHTML(ctx.i18n.t("admin_view_btn_text"), Extra.HTML()
                            .markup(Markup.keyboard(await AdminController.generateAdminMarkButtons(ctx, [_id, "0.2"])).resize()));
                        break;
                    case ctx.i18n.t("admin_delete_with_id"):
                        ctx.session.user.level = "0.2.1";
                        await ctx.replyWithHTML(ctx.i18n.t(`admin_delete`), Extra.HTML()
                            .markup(Markup.keyboard(await AdminController.generateAdminMarkButtons(ctx, [_id, "0.2.1"])).resize()));
                        break;
                    case ctx.i18n.t("agree"):
                        const {
                            key,
                            id
                        } = config.MARKUP_BUTTONS_LIST[level]?.method === BtnMethods.CREATE ?
                            await AdminController.createData(ctx, level) :
                            await AdminController.deleteData(ctx, level);

                        await ctx.replyWithHTML(ctx.i18n.t("admin_agree_decision")
                            .replace(key, id), Extra.HTML()
                            .markup(Markup.keyboard(await AdminController.generateAdminMarkButtons(ctx, [_id, level])).resize()));

                        ctx.session.text = undefined;
                        ctx.session.file = undefined;
                        ctx.session.file_type = undefined;
                        break;
                    case ctx.i18n.t("cancel"):
                        ctx.session.text = undefined;
                        ctx.session.file = undefined;
                        ctx.session.file_type = undefined;
                        await ctx.replyWithHTML(ctx.i18n.t("admin_cancel_decision"), Extra.HTML()
                            .markup(Markup.keyboard(await AdminController.generateAdminMarkButtons(ctx, [_id, level])).resize()));
                        break;
                    case ctx.i18n.t("back"):
                        ctx.session.text = undefined;
                        ctx.session.file = undefined;
                        ctx.session.file_type = undefined;

                        let decrease_level = level === "0" ? level : level.substring(0, level.lastIndexOf("."));

                        ctx.session.user.level = decrease_level;

                        const back_btns = await AdminController.generateAdminMarkButtons(ctx, [_id, decrease_level]);

                        await ctx.replyWithHTML(ctx.i18n.t("admin_back_text"), Extra.HTML()
                            .markup(Markup.keyboard(back_btns.btns ? back_btns.btns : back_btns).resize()));
                        break;
                    case ctx.i18n.t("admin_change_lang"):

                        const placeholder = await ctx.reply("...", {
                            reply_markup: {remove_keyboard: true},
                        });

                        await ctx.telegram.deleteMessage(placeholder.chat.id, placeholder.message_id);
                        await AdminController.changeLang(ctx);
                        break;
                    default:
                        switch (level) {
                            case "0.1.0.0":
                                ctx.session.text = text;
                                await ctx.replyWithHTML(ctx.i18n.t("admin_this_is_right_sure"), Extra.HTML()
                                    .markup(Markup.keyboard(await UserControllerCore.generateAgreeButton(ctx)).resize()));
                                break;
                            case "0.1.0.1":
                                ctx.session.text = text;
                                if (ctx.session?.file && text) {
                                    await ctx.replyWithHTML(ctx.i18n.t("admin_this_is_right_sure"), Extra.HTML()
                                        .markup(Markup.keyboard(await UserControllerCore.generateAgreeButton(ctx)).resize()));
                                }
                                break;
                            case "0.1.0.2":
                                ctx.session.text = text;
                                await ctx.replyWithHTML(ctx.i18n.t("admin_this_is_right_sure"), Extra.HTML()
                                    .markup(Markup.keyboard(await UserControllerCore.generateAgreeButton(ctx)).resize()));
                                break;
                            case "0.2.1":
                                ctx.session.text = text;
                                await ctx.replyWithHTML(ctx.i18n.t("admin_this_is_right_sure"), Extra.HTML()
                                    .markup(Markup.keyboard(await UserControllerCore.generateAgreeButton(ctx)).resize()));
                                break;
                            default:
                                ctx.replyWithHTML(ctx.i18n.t("admin_default_message"));
                                break;
                        }
                }
            } else {
                await next();
            }
        });
    }
}

module.exports = AdminMain;