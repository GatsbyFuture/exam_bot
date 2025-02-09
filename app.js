// main catching error handling
process.on("unhandledRejection", (e) => console.log("unhandledRejection:", e));

process.on("uncaughtException", (e) => console.log("uncaughtException:", e));

process.on("rejectionHandled", (e) => console.log("rejectionHandled:", e));

process.env.TZ = "Asia/Tashkent";
// db connection and configuration
const {bot_token} = require("./root/config/config");
const Roles = require("./root/core/enums/roles.enum");
require("./root/core/mongodb/connection");
// main npm packages
const Telegraf = require("telegraf");
const session = require("telegraf/session");

const bot = new Telegraf(bot_token);
// calling Primary middleware
const middlewarePrimary = require("./root/core/middleware/middleware.primary");
// calling main body of bot
const CoreMain = require("./root/core/core.main");
const UserMain = require("./root/modules/user/user.main");
const AdminMain = require("./root/modules/admin/admin.main");

bot.use(middlewarePrimary.errorHandler);

bot.use(session({defaultSession: () => ({})}));
// custom middleware
bot.use(middlewarePrimary.updateHandler);
// main logic
new CoreMain(bot);
new UserMain(bot);
new AdminMain(bot);

bot.catch((e) => {
    console.log("Bot error: ", e);
});

bot.launch();