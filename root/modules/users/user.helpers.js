const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");

class UserHelpers {
    async editInlineQuery(ctx) {
        const currentDate = new Date().toLocaleString("uz-UZ", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        await ctx.editMessageCaption(
            `${ctx.update.callback_query.message.caption}\n\n 📅 ${currentDate}`,
            {parse_mode: "HTML"}
        );
    }
}

module.exports = new UserHelpers();