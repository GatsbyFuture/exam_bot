const UserService = require("./user.service");
const UserHelpers = require("./user.helpers");
const config = require("./user.config");

class UserController extends UserService {
    async generateUserButtons(ctx, data) {
        const [_id, level] = data;

        await this.updateLevel(_id, level);

        const btn_keys = config.MARKUP_BUTTONS_LIST.filter(btn_key => btn_key.level === level);

        return await UserHelpers.generateButtonMarkup(ctx, btn_keys);
    }
}

module.exports = new UserController();