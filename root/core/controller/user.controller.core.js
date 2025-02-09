const UserServiceCore = require("../service/user.service.core");
const Roles = require("../enums/roles.enum");
const Langs = require("../enums/langs.enum");

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
}

module.exports = new UserControllerCore();