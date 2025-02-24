const fs = require("fs");
const axios = require("axios");
const Markup = require("telegraf/markup");
const config = require("../../config/config");

const CoreHelpers = require("../../core/helpers/core.helpers");
const fileTypesEnum = require("../../core/enums/file.types.enum");

class AnswersHelpers {
    async polishingAnswersText(text) {
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

        save_path = config.static + `${fileTypesEnum.EXCEL.path}${file_name}`;

        const save_file = await CoreHelpers.saveDocument(url, save_path);

        if (save_file.success) {
            return {
                success: true,
                file_path: save_path,
            };
        }

        return save_file;
    }

    async polishingAnswersExcel(data) {
        try {
            let variants = {};
            let currentId = null;

            data.forEach(row => {
                if (typeof row.num === "string" && row.num.startsWith("#")) {
                    const [title, id] = row.num.split(";");
                    currentId = id;
                    variants[currentId] = {
                        title: title.replace("#", ""),
                        data: []
                    };
                }
                // Header qatorini o‘tkazib yuborish
                else if (row.num === "num" && row.key === "key" && row.score === "score") {
                    // Hech narsa qilmaymiz
                }
                // Oddiy ma’lumot qatori
                else if (currentId) {
                    // Javob array ko‘rinishida
                    const keyArray = row.key.includes(";") ? row.key.split(";") : [row.key];

                    // Ball array ko‘rinishida (yo‘q bo‘lsa default qiymat)
                    let scoreArray;
                    if (row.score === undefined || row.score === null || row.score === "") {
                        scoreArray = [0]; // Default qiymat sifatida [0] qo‘yamiz
                    } else {
                        scoreArray = row.score.toString().includes(";")
                            ? row.score.split(";").map(num => Number(num) || 0) // Agar Number NaN bo‘lsa, 0 qo‘yamiz
                            : [Number(row.score) || 0];
                    }

                    variants[currentId].data.push({
                        num: row.num,
                        key: keyArray,
                        score: scoreArray,
                        single: keyArray.length === 1
                    });
                }
            });

            return {
                success: true,
                variants: variants
            };

        } catch (e) {
            console.error(e);
            return {
                success: false,
            };
        }
    }
}

module.exports = new AnswersHelpers();