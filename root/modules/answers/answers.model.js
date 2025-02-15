const mongoose = require("mongoose");
const {v4: uuid} = require("uuid");

const answersSchema = mongoose.Schema({
    _id: {
        type: String,
        default: uuid
    },
    answers_id: String,
    answer: [
        {
            num: Number,
            key: String
        }
    ],
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