const UsersAns = require("./users_ans.model");
const CustomError = require("../../errors/custom.error");

class UsersAnsService {
    async createUsersAns(data) {
        try {
            await UsersAns.create(data);
        } catch (e) {
            console.log(e);
            throw CustomError.UserAnswersError(422, "An error occurred while creating UsersAns");
        }
    }

    async getResultsBySheetId(id) {
        const results = await UsersAns.find({sheet: id})
            .populate("user_id")
            .populate("sheet_id")
            .select("-__v");

        if (!results.length) {
            throw CustomError.UserAnswersError(404, "Not found any results!");
        }

        return results;
    }

    async readUsersResults(user_id) {
        return UsersAns.find({user_id})
            .populate("sheet_id")
            .select("-__v")
            .sort({createdAt: -1})
            .limit(5);
    }
}

module.exports = UsersAnsService;