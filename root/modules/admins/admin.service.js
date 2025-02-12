const User = require("../../core/models/user.models.core");

class AdminService {
    async updateLevel(id, level) {
        await User.updateOne(
            {_id: id},
            {$set: {level}},
        ).lean();
    }
}

module.exports = AdminService;