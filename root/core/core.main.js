const TelegrafI18n = require("telegraf-i18n");
const path = require("path");
const {bot_name} = require("../config/config");

const CoreController = require("./controller/core.controller");
const CoreHelpers = require("./helpers/core.helpers");

const coreI18n = new TelegrafI18n({
    defaultLanguage: "oz",
    useSession: true,
    defaultLanguageOnMissing: true,
    directory: path.resolve(__dirname, "locales"),
});

class CoreMain {
    constructor(bot) {
        bot.use(coreI18n.middleware());

        bot.command("start", (ctx) => {
            const replyText = ctx.i18n.t("core_greeting").replace("*{bot_name}*", bot_name);
            ctx.replyWithHTML(replyText);
            CoreHelpers.langs(ctx);
        });

        // User accept offer to group or chanel
        bot.action(/I_am_+/, async (ctx) => {
            const chatId = ctx.update.callback_query.from.id;
            const status = await CoreHelpers.checkUserInGroup(chatId);
            console.log(status);
            if (!status || status === "left") {
                ctx.telegram.sendMessage(chatId, "...", {
                    "reply_markup": {
                        "remove_keyboard": true
                    }
                }).then((data) => {
                    ctx.telegram.deleteMessage(chatId, data.message_id);
                });
                await CoreHelpers.offerToGroup(chatId, ctx);
            } else {
                CoreHelpers.langs(ctx);
            }
        });

        bot.hears(/^dtm@(admin|user)777$/, async (ctx) => {
            const userRole = ctx.match[1];
            const {_id, name} = ctx.session.user;

            const updatedRole = await CoreController.updateUserRole(_id, userRole);

            if (updatedRole) {
                ctx.session.user.role = userRole;
            }

            const replyText = ctx.i18n.t("core_role_updated")
                .replace("*{user_name}*", name.first_name ? name.first_name : "user")
                .replace("*{role}*", userRole);

            ctx.replyWithHTML(replyText);

            const placeholder = await ctx.reply("...", {
                reply_markup: {remove_keyboard: true},
            });

            await ctx.telegram.deleteMessage(
                placeholder.chat.id,
                placeholder.message_id
            );

            CoreHelpers.langs(ctx);
        });
    }
}

module.exports = CoreMain;