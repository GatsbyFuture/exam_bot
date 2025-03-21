const mongoose = require("mongoose");
const {v4: uuid} = require("uuid");

const answersSchema = mongoose.Schema({
        _id: {
            type: String,
            default: uuid
        },
        answers_id: {
            type: Number,
            default: () => Math.floor(Date.now() / 1000) // UNIX timestamp
        },
        answers: [
            {
                num: Number,
                key: [],
                score: [],
                single: {
                    type: Boolean,
                    default: true
                }
            }
        ],
        has_score: {
            type: Boolean,
            default: false
        },
        sheet_id: {
            type: String,
            ref: "sheets"
        },
        sheet: Number,
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
    }, {
        timestamps: true
    }
);

const Answers = mongoose.model("answers", answersSchema);

module.exports = Answers;