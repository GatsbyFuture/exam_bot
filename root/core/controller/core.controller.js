const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");
const UserServiceCore = require("../service/core.service");
const Roles = require("../../enums/roles.enum");
const Langs = require("../../enums/langs.enum");
const HelpersCore = require("../helpers/core.helpers");

class CoreController extends UserServiceCore {
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

    async generateAgreeButton(ctx) {
        return HelpersCore.generateMarkupBtnAgree(ctx);
    }
}

module.exports = new CoreController();