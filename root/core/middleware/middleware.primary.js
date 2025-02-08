const UserControllerCore = require("../controller/user.controller.core");
const Roles = require("../enums/roles.enum");
const Langs = require("../enums/langs.enum");

const updateTime = async (ctx, next) => {
    // all events will pass here
    console.log(ctx.update);
    if (ctx.update.inline_query) {
        return next();
    }

    if (ctx.update.message && ctx.update.message?.text !== "/start") {
        return next();
    }

    if (ctx.update.callback_query) {
        return next();
    }

    const user = await UserControllerCore.createUser({
        chat_id: ctx.update.message.from.id,
        user_name: ctx.update.message.from?.username,
        name: {
            first_name: ctx.update.message.from?.first_name
        },
        role: Roles.USER,
        lang: Langs.OZ
    });

    if (user && ctx.session) {
        ctx.session.user = user;
    }
    // ctx.i18n.locale(user.lang);
    return next();
};

module.exports = {
    updateTime,
};