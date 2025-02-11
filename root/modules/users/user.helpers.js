const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");

class UserHelpers {
    async generateMarkupButtons(ctx, btn_keys, level) {
        let groupedButtons = btn_keys.reduce((acc, btn) => {
            acc[btn.position] = acc[btn.position] || [];
            acc[btn.position].push(Markup.button(ctx.i18n.t(btn.name)));
            return acc;
        }, {});

        let buttons = Object.values(groupedButtons);

        if (level !== "0") {
            buttons.push([Markup.button(ctx.i18n.t("back"))]);
        }

        return buttons;
    }
}

module.exports = new UserHelpers();