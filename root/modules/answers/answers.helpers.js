const Markup = require("telegraf/markup");
const AnswersService = require(".//answers.service");

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

    async generateAnswersBtn(lang) {
        const answers = await AnswersService.getAnswersWithFilter({});
        // console.log(answers);
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

    async generateAnswersShow(answers, lang) {
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
}

module.exports = new AnswersHelpers();