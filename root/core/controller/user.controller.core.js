const UserServiceCore = require("../service/user.service.core");
const Roles = require("../enums/roles.enum");
const Langs = require("../enums/langs.enum");
const config = require("../../modules/admins/admin.config");
const SheetsService = require("../../modules/sheets/sheets.service");
const HelpersCore = require("../helpers/helpers.core");
const CustomError = require("../errors/custom.error");

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

    async sendTestDocument(ctx, id) {
        const {level, lang} = ctx.session.user;
        // const btn_keys = config.MARKUP_BUTTONS_LIST[level];

        // if (btn_keys["method"] === BtnMethods.READ) {
        const sheet = await SheetsService.getBySheetId(id);

        if (!sheet) {
            throw CustomError.SheetNotFoundError(ctx.i18n.t("sheet_not_found"));
        }

        const filePath = sheet.file_path;
        const caption = ctx.i18n.t("sheet_caption")
            .replace("*{ID}*", sheet.sheet_id)
            .replace("*{title}*", sheet.title[lang])
            .replace("*{desc}*", sheet.desc[lang]);

        await ctx.replyWithPhoto(
            {source: filePath},
            {
                caption: caption,
                protect_content: true,
                parse_mode: "HTML"
            },
        );
        // }
    }

    async generateAgreeButton(ctx) {
        return HelpersCore.generateMarkupBtnAgree(ctx);
    }
}

module.exports = new UserControllerCore();