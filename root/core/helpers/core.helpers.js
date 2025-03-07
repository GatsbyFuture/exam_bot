const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");
const axios = require("axios");
const fs = require("fs");
const Roles = require("../../enums/roles.enum");
const config = require("../../config/config");

class CoreHelpers {
    separateToChatId(ctx) {
        if (ctx.update?.message)
            return ctx.update.message.from.id;
        if (ctx.update?.callback_query)
            return ctx.update.callback_query.from.id;
    }

    langs(ctx) {
        const role = ctx.session.user.role;

        let btns = [
            [Markup.callbackButton("🇺🇿 O'zbekcha", `${role}_lang.oz`)],
            [Markup.callbackButton("🇺🇿 Ўзбекча", `${role}_lang.uz`)],
        ];

        ctx.replyWithHTML(
            ctx.i18n.t("core_lang"),
            Extra.HTML().markup(Markup.inlineKeyboard(btns))
        );
    }

    async generateMarkupButtonsStatic(ctx, btn_keys, level) {
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

    async generateMarkupBtnAgree(ctx) {
        return [
            [Markup.button(ctx.i18n.t("agree"))],
            [Markup.button(ctx.i18n.t("cancel"))]
        ];
    }

    async saveDocument(url, path) {
        try {
            const response = await axios({
                url: url,
                method: "GET",
                responseType: "stream",
            });

            const writer = fs.createWriteStream(path);
            response.data.pipe(writer); // response.file → response.data

            return new Promise((resolve, reject) => {
                writer.on("finish", () => {
                    resolve({success: true});
                });

                writer.on("error", (e) => {
                    console.error(e);
                    reject({success: false});
                });
            });
        } catch (e) {
            console.error(e);
            return {success: false};
        }
    }

    async sendTestDocument(ctx, lang, sheet, markup = false) {

        const filePath = sheet.file_path;

        let caption = ctx.i18n.t("sheet_caption")
            .replace("*{ID}*", sheet.sheet_id)
            .replace("*{title}*", sheet.title[lang])
            .replace("*{desc}*", sheet?.desc[lang]);

        const extra = {
            protect_content: true,
            parse_mode: "HTML",
        };

        if (markup && sheet.has_answers) {
            extra.reply_markup = Markup.inlineKeyboard([
                [
                    Markup.callbackButton(
                        ctx.i18n.t("check_answers_one_time"),
                        `compare_test.${sheet.sheet_id}`
                    )
                ]
            ]);
        }

        if (!sheet.has_answers) {
            caption += "\n" + ctx.i18n.t("not_found_answers");
        }

        extra.caption = caption;
        console.log(extra, filePath);
        await ctx.replyWithDocument(
            {source: filePath},
            extra
        );
    }

    async checkUserInGroup(user_id) {
        try {
            const res = await axios.get(`${config.bot_url}getChatMember?chat_id=${config.group_id}&user_id=${user_id}`);
            return res.data.result.status;
        } catch (e) {
            console.error("Guruh a’zoligini tekshirishda xato:", e);
            return null;
        }
    }

    async offerToGroup(chat_id, ctx) {
        const keyboard = {
            reply_markup: {
                inline_keyboard: [
                    [{url: `${config.group_url}`, text: "✍️ KANALIMIZGA A'ZO BO'LISH ✍️"}],
                    [{callback_data: "I_am_here", text: "✅ KANALGA A'ZO BO'LDIM ✅"}]
                ]
            }
        };
        const text = "ASSALOMU ALAYKUM! XUSH KELIBSIZ!\nBOTDAN FOYDALANISH UCHUN AVVAL KANALIMIZGA A'ZO BO'LISHINGIZ KERAK";
        await ctx.telegram.sendMessage(
            chat_id,
            text,
            keyboard
        );
    }
}

module.exports = new CoreHelpers();