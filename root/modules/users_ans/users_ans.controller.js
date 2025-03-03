const UsersAnsService = require("./users_ans.service");

class UsersAnsController extends UsersAnsService {
    async create(UsersAnsData) {
        await this.createUsersAns(UsersAnsData);
    }
}

module.exports = new UsersAnsController();