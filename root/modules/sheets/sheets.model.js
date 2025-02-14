const mongoose = require("mongoose");
const {v4: uuid} = require("uuid");

const sheetSchema = mongoose.Schema({
    _id: {
        type: String,
        default: uuid
    },
    sheet_id: {
        type: Number,
        default: () => Math.floor(Date.now() / 1000) // UNIX timestamp
    },
    title: {
        oz: {
            type: String,
            required: true
        },
        uz: {
            type: String,
            required: true
        },
    },
    desc: {
        oz: {
            type: String,
            required: true
        },
        uz: {
            type: String,
            required: true
        },
    },
    category_id: String,
    img_url: String,
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
    },
});

const Sheet = mongoose.model("sheets", sheetSchema);

module.exports = Sheet;