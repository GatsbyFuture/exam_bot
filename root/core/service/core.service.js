const User = require("../models/core.model");
const CustomError = require("../../errors/custom.error");

class CoreService {
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

    async updateLang(id, lang) {
        const user = await User.findByIdAndUpdate(
            id,
            {$set: {lang}},
            {new: true}
        ).lean();

        if (!user) {
            throw CustomError.UserNotFoundError();
        }

        return true;
    }

    async updateLevel(id, level) {
        await User.updateOne(
            {_id: id},
            {$set: {level}},
        ).lean();
    }
}

module.exports = CoreService;