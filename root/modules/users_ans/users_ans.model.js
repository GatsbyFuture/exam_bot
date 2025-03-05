const mongoose = require("mongoose");
const {v4: uuid} = require("uuid");

const usersAnsSchema = mongoose.Schema({
        _id: {
            type: String,
            default: uuid
        },
        sheet: Number,
        user_id: {
            type: String,
            ref: "users"
        },
        sheet_id: {
            type: String,
            ref: "sheets"
        },
        total: Number,
        total_corrects: Number,
        total_corrects_score: Number,
        date: String,
        status: {
            type: Boolean,
            default: true // true or false
        }
    }, {
        timestamps: true,
    }
);

const UsersAns = mongoose.model("users_ans", usersAnsSchema);

module.exports = UsersAns;