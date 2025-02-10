const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");

class UserHelpers {
    async generateButtonMarkup(ctx, btn_keys) {
        let groupedButtons = btn_keys.reduce((acc, btn) => {
            acc[btn.position] = acc[btn.position] || [];
            acc[btn.position].push(Markup.button(btn.name));
            return acc;
        }, {});

        return Object.values(groupedButtons);
    }
}

module.exports = new UserHelpers();