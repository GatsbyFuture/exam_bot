const fs = require("fs");
const axios = require("axios");
const Markup = require("telegraf/markup");
const config = require("../../config/config");

const CoreHelpers = require("../../core/helpers/core.helpers");
const fileTypesEnum = require("../../core/enums/file.types.enum");

class AnswersHelpers {
    async polishingAnswersData(text) {
        const idMatch = text.match(/#id:(\d+)/);
        const answersMatch = text.match(/#answers:([\d.ABCDE,]+)/);
        const posMatch = text.match(/#pos:(\d+)/);

        const sheet = parseInt(idMatch[1], 10);
        const position = posMatch ? parseInt(posMatch[1], 10) : undefined;

        const answers = answersMatch[1].split(",").map((answer) => {
            const match = answer.match(/(\d+)\.([ABCDE])/);
            if (match) {
                return {num: parseInt(match[1], 10), key: match[2]};
            }
            return null;
        }).filter(Boolean);

        return {sheet, answers, position};
    }

    async generateAnswersBtn(answers, lang) {
        const btns = answers.map(answer => {
            return (
                [Markup.button(
                    `${answer.sheet_id?.title[lang]} #${answer.answers_id}`
                )]
            );
        });

        return {
            total: btns.length,
            btns: btns
        };
    }

    async generateAnswersText(answers, lang) {
        const sheet_title = answers.sheet_id?.title[lang] || "No title";
        const answersText = answers.answers
            .map(item => `${item.num}. ${item.key}`)
            .join("\n");

        return {
            sheet_title: sheet_title,
            answers_id: answers.answers_id,
            answers_text: answersText
        };
    }

    async createAnswerDocument(file_name, file) {
        const file_extension = file.file_path.split(".").pop();
        const url = config.bot_file_path + file.file_path;
        let save_path = "";

        save_path = config.static + `${fileTypesEnum.EXCEL.path}${file_name}.${file_extension}`;

        const save_file = await CoreHelpers.saveDocument(url, save_path);

        if (save_file.success) {
            return {
                success: true,
                file_path: save_path,
            };
        }

        return save_file;
    }
}

module.exports = new AnswersHelpers();