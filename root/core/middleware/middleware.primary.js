const updateTime = async (ctx, next) => {
    // all events will pass here
    console.log(ctx.update);
    if (ctx.update.inline_query) {
        return next();
    }

    if (ctx.update.message && ctx.update.message?.text !== "/start") {
        console.log('update');
        return next();
    }

    if (ctx.update.callback_query) {
        return next();
    }

    return next();
}

module.exports = {
    updateTime,
}