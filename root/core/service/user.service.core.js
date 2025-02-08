const User = require('../models/user.models.core');

class UserServiceCore {
    async create(data) {
        const user = await User.create(data);
        return user;
    }
}

module.exports = UserServiceCore;