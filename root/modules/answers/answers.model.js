const mongoose = require("mongoose");
const {v4: uuid} = require("uuid");

const answersSchema = mongoose.Schema({
    _id: {
        type: String,
        default: uuid
    },
    answers_id: String,
    answers: [
        {
            num: Number,
            key: String
        }
    ],
    sheet_id: String,
    position: {
        type: Number,
        default: 0
    },
    is_public: {
        type: Boolean,
        default: true
    },
    is_active: {
        type: Boolean,
        default: true
    }
});

const Answers = mongoose.model("answers", answersSchema);

module.exports = Answers;