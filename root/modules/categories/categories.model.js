const mongoose = require("mongoose");
const {v4: uuid} = require("uuid");

const categorySchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuid
    },
    category_id: {
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
}, {timestamps: true});

const Category = mongoose.model("categories", categorySchema);

module.exports = Category;