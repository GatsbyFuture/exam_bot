process.on("unhandledRejection", (e) => console.log("unhandledRejection:", e));

process.on("uncaughtException", (e) => console.log("uncaughtException:", e));

process.on("rejectionHnadled", (e) => console.log("rejectionHnadled:", e));

process.env.TZ = "Asia/Tashkent";

const {bot_token} = require("./root/config/config");
require("./root/core/mongodb/connection");

const {Telegraf, session} = require("telegraf");
const {updateTime} = require("./root/core/middleware/middleware.primary");

const bot = new Telegraf(bot_token);

bot.use(session());

// custom middleware
bot.use(updateTime);
// main logic
bot.command("start", async (ctx) => {

    await ctx.reply(`Привет, ${ctx.from.first_name}!`);
});

bot.catch((e) => {
    console.log("Bot error: ", e);
});

bot.launch();