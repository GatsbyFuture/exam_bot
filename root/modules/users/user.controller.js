const UserService = require("./user.service");
const HelpersCore = require("../../core/helpers/helpers.core");
const config = require("./user.config");

class UserController extends UserService {
    async generateUserMarkButtons(ctx, data) {
        const [_id, level] = data;

        await this.updateLevel(_id, level);

        const btn_keys = config.MARKUP_BUTTONS_LIST[level];

        if (Array.isArray(btn_keys)) {
            return await HelpersCore.generateMarkupButtons(ctx, btn_keys, level);
        } else {
            // get data from db and generate buttons
        }
    }
}

module.exports = new UserController();