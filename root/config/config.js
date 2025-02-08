require('dotenv').config();

module.exports = {
    group_id: -235113124,

    db_host: `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@127.0.0.1:${process.env.DB_PORT}/exam`,
    db_user: process.env.DB_USER,
    db_pass: process.env.DB_PASS,

    bot_token: process.env.BOT_TOKEN,
    bot_username: 'qwerty',
}