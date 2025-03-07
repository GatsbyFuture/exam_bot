require("dotenv").config();

module.exports = {
    bot_name: "EXAM BOT",
    group_id: -1002271472217,
    // group_id: -1002274948655,
    group_url: "https://t.me/+5X2n3ZFO1kJhZDdi",
    // group_url: "https://t.me/Fizika_Pro",

    db_host: `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@127.0.0.1:${process.env.DB_PORT}/exam`,
    db_user: process.env.DB_USER,
    db_pass: process.env.DB_PASS,

    bot_token: process.env.BOT_TOKEN,
    // bot_username: "@Fizika_Pro1_bot",
    bot_username: "@exam_DTM_bot",
    bot_url: `https://api.telegram.org/bot${process.env.BOT_TOKEN}/`,
    bot_file_path: `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/`,

    static: process.env.STATIC
};