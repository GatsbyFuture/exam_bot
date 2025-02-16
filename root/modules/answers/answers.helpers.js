const Markup = require("telegraf/markup");

class AnswersHelpers {
    async polishingAnswersData(text) {
        const idMatch = text.match(/#id:(\d+)/);
        const posMatch = text.match(/#pos:(\d+)/);
        const answersMatch = text.match(/#answers:([\d.ABCDE,]+)/);

        const sheet_id = parseInt(idMatch[1], 10);
        const position = posMatch ? parseInt(posMatch[1], 10) : undefined;

        const answers = answersMatch[1].split(",").map((answer) => {
            const match = answer.match(/(\d+)\.([ABCDE])/);
            if (match) {
                return {num: parseInt(match[1], 10), key: match[2]};
            }
            return null;
        }).filter(Boolean);

        return {sheet_id, answers, position};
    }
}

module.exports = new AnswersHelpers();