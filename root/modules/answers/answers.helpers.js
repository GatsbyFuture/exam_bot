const fs = require("fs");
const axios = require("axios");
const Markup = require("telegraf/markup");
const config = require("../../config/config");

const CoreHelpers = require("../../core/helpers/core.helpers");
const fileTypesEnum = require("../../core/enums/file.types.enum");

class AnswersHelpers {
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
            .map(item => {
                // `key` massivni stringga aylantirish: ["A"] → "A", ["20", "120"] → "20;120"
                const keyString = item.key.join(";");
                const scoreString = item.score.join(";");
                return `${item.num}. ${keyString} (Score: ${scoreString})`;
            })
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

    async polishingAnswersText(text) {
        const idMatch = text.match(/#id:(\d+)/);
        const answersMatch = text.match(/#answers:([^#]+)/); // #answers dan keyingi hamma narsa
        const posMatch = text.match(/#pos:(\d+)/);

        const sheet = parseInt(idMatch[1], 10);
        const position = posMatch ? parseInt(posMatch[1], 10) : undefined;

        const answers = answersMatch[1].split(",").map((answer) => {
            // Har bir javob uchun raqam va qiymatni ajratish
            const match = answer.match(/(\d+)-(.+)/);
            if (match) {
                const num = parseInt(match[1], 10);
                const keyText = match[2]; // "A" yoki "20;120" yoki "2.5" yoki "-4"
                // Agar ";" bo‘lsa, massivga bo‘lamiz, aks holda bitta elementli massiv
                const key = keyText.includes(";") ? keyText.split(";") : [keyText];
                return {num, key};
            }
            return null;
        }).filter(Boolean);

        return {sheet, answers, position};
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
                } else if (row.num === "num" && row.key === "key" && row.score === "score") {
                    // returned nothing
                } else if (currentId) {
                    // answer form array
                    const keyArray = row.key.includes(";") ? row.key.split(";") : [row.key];

                    let scoreArray;
                    if (row.score === undefined || row.score === null || row.score === "") {
                        scoreArray = [0]; // Default value [0]
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