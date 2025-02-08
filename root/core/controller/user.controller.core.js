const UserServiceCore = require('../service/user.service.core');

class UserControllerCore extends UserServiceCore {
    async createUser(data) {
        return await this.create(data);
    }
}

module.exports = new UserControllerCore();