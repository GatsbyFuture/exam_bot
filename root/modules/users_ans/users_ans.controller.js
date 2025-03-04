const UsersAnsService = require("./users_ans.service");
const UsersAnsHelpers = require("./users_ans.helpers");

class UsersAnsController extends UsersAnsService {
    async create(UsersAnsData) {
        await this.createUsersAns(UsersAnsData);
    }

    async readUsersAns(text_key, user_id) {
        const result = await this.readUsersResults(user_id);
        console.log(result);
        return await UsersAnsHelpers.polishingUsersAns(text_key, result);
    }
}

module.exports = new UsersAnsController();