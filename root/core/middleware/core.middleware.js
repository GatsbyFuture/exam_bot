const axios = require("axios");
const CoreController = require("../controller/core.controller");
const CoreHelpers = require("../helpers/core.helpers");
const CustomError = require("../../errors/custom.error");
const config = require("../../config/config");
const Roles = require("../../enums/roles.enum");
const Langs = require("../../enums/langs.enum");

module.exports = class MiddlewarePrimary {
    static async errorHandler(ctx, next) {
        try {
            await next();
        } catch (e) {
            if (e instanceof CustomError) {
                await ctx.reply(`❌ Xatolik: ${e.message}`);
            } else {
                console.error("Noma‘lum xatolik:", e);
                await ctx.reply("❌ Ichki xatolik yuz berdi, keyinroq qayta urinib ko‘ring.");
            }
        }
    }

    static async updateHandler(ctx, next) {
        // all events will pass here
        console.log(ctx.update);
        if (ctx.update.inline_query && ctx.session?.user) {
            return next();
        }

        if (ctx.update.message && ctx.update.message?.text !== "/start" && ctx.session?.user) {
            if (ctx.update.message.chat.id === config.group_id) {
                return undefined;
            }
            return next();
        }

        if (ctx.update.callback_query && ctx.session?.user) {
            return next();
        }

        const chatId = ctx.update?.message?.from?.id;

        if (chatId) {
            let {success, user} = await CoreController.getUserOne(chatId);
            if (success) {
                ctx.session.user = user;
            } else {
                let {success, user} = await CoreController.createUser(ctx.update.message);
                ctx.session.user = user;
            }
        } else {
            throw CustomError.InternalError();
        }
        // console.log(ctx.session.user);
        return next();
    }

    static async checkGroupUser(ctx, next) {
        const {chat_id} = ctx.session.user;
        const status = await CoreHelpers.checkUserInGroup(chat_id);

        if (!status || status === "left") {
            const msg = await ctx.telegram.sendMessage(chat_id, "...", {
                reply_markup: {remove_keyboard: true}
            });
            await ctx.telegram.deleteMessage(chat_id, msg.message_id);
            await CoreHelpers.offerToGroup(chat_id, ctx);
        } else {
            return next();
        }
    }
};