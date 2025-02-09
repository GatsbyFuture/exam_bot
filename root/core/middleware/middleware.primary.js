const UserControllerCore = require("../controller/user.controller.core");
const CustomError = require("../errors/custom.error");
const Roles = require("../enums/roles.enum");
const Langs = require("../enums/langs.enum");

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
            return next();
        }

        if (ctx.update.callback_query && ctx.session?.user) {
            return next();
        }

        const chatId = ctx.update?.message?.from?.id;

        if (chatId) {
            let {success, user} = await UserControllerCore.getUserOne(chatId);
            if (success) {
                ctx.session.user = user;
            } else {
                let {success, user} = await UserControllerCore.createUser(ctx.update.message);
                ctx.session.user = user;
            }
        } else {
            throw CustomError.InternalError();
        }
        // console.log(ctx.session.user);
        return next();
    }
};