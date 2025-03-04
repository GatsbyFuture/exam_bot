// main catching error handling
process.on("unhandledRejection", (e) => console.log("unhandledRejection:", e));

process.on("uncaughtException", (e) => console.log("uncaughtException:", e));

process.on("rejectionHandled", (e) => console.log("rejectionHandled:", e));

const path = require("path");

process.env.TZ = "Asia/Tashkent";
process.env.STATIC = path.join(__dirname, "root/static/");

// db connection and configuration
const {bot_token} = require("./root/config/config");
const Roles = require("./root/enums/roles.enum");
require("./root/connection/mongodb/connection");
// main npm packages
const Telegraf = require("telegraf");
const session = require("telegraf/session");

const bot = new Telegraf(bot_token);
// calling Primary middleware
const MiddlewarePrimary = require("./root/core/middleware/core.middleware");
// calling main body of bot
const CoreMain = require("./root/core/core.main");
const UserMain = require("./root/modules/users/user.main");
const AdminMain = require("./root/modules/admins/admin.main");

bot.use(MiddlewarePrimary.errorHandler);

bot.use(session({defaultSession: () => ({user: {}, store: {text: ""}})}));
// custom middleware
bot.use(MiddlewarePrimary.updateHandler);
bot.use(MiddlewarePrimary.checkGroupUser);
// main logic
new CoreMain(bot);
new UserMain(bot);
new AdminMain(bot);

bot.catch((e) => {
    console.log("Bot error: ", e);
});

bot.launch().then(() => {
    console.log("Bot started...");
});