const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");
const UserServiceCore = require("../service/user.service.core");
const Roles = require("../enums/roles.enum");
const Langs = require("../enums/langs.enum");
const config = require("../../modules/admins/admin.config");
const SheetsService = require("../../modules/sheets/sheets.service");
const AnswersService = require("../../modules/answers/answers.service");
const HelpersCore = require("../helpers/helpers.core");
const CustomError = require("../errors/custom.error");
const {cap} = require("lodash/fp/_falseOptions");

class UserControllerCore extends UserServiceCore {
    async createUser(data) {
        const user = {
            chat_id: data.from.id,
            user_name: data.from?.username,
            name: {
                first_name: data.from?.first_name
            },
            role: Roles.USER,
            lang: Langs.OZ
        };

        return await this.create(user);
    }

    async getUserOne(chat_id) {
        return await this.findOne(chat_id);
    }

    async updateUserRole(id, role) {
        return await this.updateRole(id, role);
    }

    async updateUserLang(id, lang) {
        return await this.updateLang(id, lang);
    }

    async checkAnswersHas(sheet_id) {
        con;
    }

    async sendTestDocument(ctx, id) {
        const {level, lang, role} = ctx.session.user;

        const sheet = await SheetsService.getBySheetId(id);

        if (!sheet) {
            throw CustomError.SheetNotFoundError(ctx.i18n.t("sheet_not_found"));
        }

        const filePath = sheet.file_path;
        let caption = ctx.i18n.t("sheet_caption")
            .replace("*{ID}*", sheet.sheet_id)
            .replace("*{title}*", sheet.title[lang])
            .replace("*{desc}*", sheet.desc[lang]);

        const extra = {
            protect_content: true,
            parse_mode: "HTML",
        };

        if (role === Roles.USER) {
            if (sheet.has_answers) {
                extra.reply_markup = Markup.inlineKeyboard([
                    [Markup.callbackButton(ctx.i18n.t("check_answers_one_time"), "check_answers")]
                ]);
            } else {
                caption += "\n" + ctx.i18n.t("not_found_answers");
            }
        }

        if (role === Roles.ADMIN && !sheet.has_answers) {
            caption += "\n" + ctx.i18n.t("not_found_answers");
        }

        extra.caption = caption;
        await ctx.replyWithDocument(
            {source: filePath},
            extra
        );
    }

    async generateAgreeButton(ctx) {
        return HelpersCore.generateMarkupBtnAgree(ctx);
    }
}

module.exports = new UserControllerCore();