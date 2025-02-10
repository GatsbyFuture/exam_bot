const mongoose = require("mongoose");
const {v4: uuid} = require("uuid");
const Roles = require("../enums/roles.enum");

const userSchema = new mongoose.Schema({
        _id: {
            type: String,
            default: uuid
        },
        chat_id: String,
        user_name: {
            type: String,
            default: ""
        },
        name: {
            first_name: {
                type: String,
                default: "",
            },
            last_name: String,
            middle_name: String
        },
        role: {
            type: String,
            default: Roles.USER
        },
        blocked: {
            type: Boolean,
            default: false,
        },
        level: String,
        lang: String,
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("user", userSchema);

module.exports = User;