const User = require("../models/user.models.core");
const CustomError = require("../errors/custom.error");

class UserServiceCore {
    async create(data) {
        const user = await User.create(data);
        return {
            success: true,
            user
        };
    }

    async findOne(chat_id) {
        const user = await User
            .findOne({chat_id: chat_id})
            .select("-__v")
            .lean();

        if (!user) {
            return {
                success: false,
            };
        }

        return {
            success: true,
            user,
        };
    }

    async updateRole(id, role) {
        const user = await User.findByIdAndUpdate(
            id,
            {$set: {role}},
            {new: true}
        ).lean();

        if (!user) {
            throw CustomError.UserNotFoundError();
        }

        return true;
    }
}

module.exports = UserServiceCore;