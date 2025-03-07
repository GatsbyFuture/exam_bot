const axios = require("axios");
const CoreController = require("../controller/core.controller");
const CoreHelpers = require("../helpers/core.helpers");
const CustomError = require("../../errors/custom.error");
const config = require("../../config/config");
const Roles = require("../../enums/roles.enum");
const Langs = require("../../enums/langs.enum");
const logError = require("../../logs/logs");

module.exports = class MiddlewarePrimary {
    static async errorHandler(ctx, next) {
        try {
            await next();
        } catch (e) {
            if (e instanceof CustomError) {
                logError(`Custom xatolik => ${e.message}`);
            } else {
                logError(`Ichki xatolik => ${e.message}`);
            }
        }
    }

    static async updateHandler(ctx, next) {
        // all events will pass here
        console.log(ctx.update);
        // console.log(ctx.session.user);
        // if (ctx.update.inline_query && ctx.session?.user) {
        //     return next();
        // }
        // To detect to post and ignore it when text and event come from channel
        if (ctx.update.channel_post || ctx.update.my_chat_member) {
            return undefined;
        }

        if (ctx.update.message && ctx.update.message?.text !== "/start") {
            if (ctx.update.message.chat.id === config.group_id) {
                return undefined;
            }
            if (ctx.session?.user) {
                return next();
            }
        }

        if (ctx.update.callback_query && ctx.session?.user) {
            return next();
        }

        const chatId = CoreHelpers.separateToChatId(ctx);
        // console.log(chatId);
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