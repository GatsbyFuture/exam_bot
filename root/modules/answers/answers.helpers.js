const fs = require("fs");
const axios = require("axios");
const Markup = require("telegraf/markup");
const config = require("../../config/config");
const CustomError = require("../../errors/custom.error");

const CoreHelpers = require("../../core/helpers/core.helpers");
const fileTypesEnum = require("../../enums/file.types.enum");

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
        const idMatch = text.match(/#id\s*:(\d+)/);
        const answersMatch = text.match(/#answers\s*:([^#]+)/);

        if (!idMatch || !answersMatch) {
            throw CustomError.InCorrectDtoError("Matnda #id yoki #answers topilmadi");
        }

        const sheet = parseInt(idMatch[1], 10);

        const answers = answersMatch[1].split(",").map((answer) => {
            // Har bir javob uchun raqam, qiymat va score ni ajratish
            const match = answer.match(/(\d+)-(.+)\[(.+)\]/) || answer.match(/(\d+)-(.+)/);
            if (match) {
                const num = parseInt(match[1], 10);
                const keyText = match[2]; // "A" yoki "20;120"
                const scoreText = match[3]; // "1.3" yoki "1.5;1.7" yoki undefined

                // Key ni massivga aylantirish
                const key = keyText.includes(";") ? keyText.split(";") : [keyText];

                // Score ni massivga aylantirish
                let score;
                if (scoreText) {
                    score = scoreText.includes(";")
                        ? scoreText.split(";").map(s => Number(s) || 0)
                        : [Number(scoreText) || 0];
                } else {
                    score = [0]; // Agar score kiritilmagan bo‘lsa default 0
                }

                return {num, key, score};
            }
            return null;
        }).filter(Boolean);

        return {sheet, answers};
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

    async polishingEnteredText(text) {
        const idMatch = text.match(/#id\s*:(\d+)/);
        const answersMatch = text.match(/#answers\s*:([^#]+)/);

        if (!idMatch || !answersMatch) {
            throw CustomError.InCorrectDtoError("Matnda #id yoki #answers topilmadi");
        }

        const sheet = parseInt(idMatch[1], 10);

        const answers = answersMatch[1].split(",").map((answer) => {
            const match = answer.match(/(\d+)-(.+)/);
            if (match) {
                const num = parseInt(match[1], 10);
                let keyText = match[2].trim();
                keyText = keyText.replace(/[^A-Za-z0-9;]/g, "");
                const key = keyText.includes(";") ? keyText.split(";") : [keyText];
                return {num, key};
            }
            return null;
        }).filter(Boolean);

        return {sheet, answers};
    }

    async compareAnswers(entered_answers, answers) {
        const user_answers = new Map(
            entered_answers.map(ans => [
                ans.num,
                ans.key.map(k => k.toUpperCase()) // Har bir key elementini katta harfga aylantirish
            ])
        );

        return answers.answers.reduce((acc, {num, key, score}) => {
            // Massivlarni taqqoslash uchun yordamchi funksiya
            const areArraysEqual = (arr1, arr2) => {
                if (!arr1 || !arr2) return false;
                if (arr1.length !== arr2.length) return false;
                return arr1.every((elem, index) => elem === arr2[index]);
            };

            // Qisman moslikni tekshirish va ballni hisoblash
            const getPartialMatch = (userKey, correctKey, correctScore) => {
                let partialScore = 0;
                const resultParts = [];

                userKey.forEach((uk, i) => {
                    const ck = correctKey[i];
                    if (uk === ck) {
                        resultParts.push(`✅ ${uk}`);
                        partialScore += correctScore[i];
                    } else {
                        resultParts.push(`❌ ${uk}`);
                    }
                });

                return {partialScore, resultText: resultParts.join(";")};
            };

            const userAnswerKey = user_answers.get(num);
            const scoreString = score.join(";");

            if (userAnswerKey === undefined) {
                acc.results.push(`${num}: ❌ (Belgilamagan) (Ball: ${scoreString})`);
            } else if (!areArraysEqual(userAnswerKey, key)) {
                // Qisman moslikni tekshirish
                const {partialScore, resultText} = getPartialMatch(userAnswerKey, key, score);
                if (partialScore > 0) {
                    acc.results.push(`${num}: ${resultText} (Ball: ${scoreString}, qisman: ${partialScore})`);
                    acc.total_corrects_score += partialScore;
                    acc.total_corrects += 1; // Qisman to‘g‘ri javoblar soni
                } else {
                    acc.results.push(`${num}: ❌ ${userAnswerKey.join(";")} (Ball: ${scoreString})`);
                }
            } else {
                acc.results.push(`${num}: ✅ ${key.join(";")} (Ball: ${scoreString})`);
                acc.total_corrects += 1;
                acc.total_corrects_score += score.reduce((sum, s) => sum + s, 0);
            }
            acc.total += 1;
            return acc;
        }, {
            results: [],
            total_corrects: 0,
            total_corrects_score: 0,
            total: 0,
            sheet: answers.sheet,
            sheet_id: answers.sheet_id
        });
    }
}

module.exports = new AnswersHelpers();