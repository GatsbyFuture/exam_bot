class UsersAnsHelpers {
    async polishingUsersAns(key_words, data) {
        const {empty, date, title, total, total_corts, total_corts_score} = key_words;

        if (!Array.isArray(data) || !data.length) {
            return empty;
        }

        const formattedResults = data.map((item, index) => {
            return `${index + 1}. ${date}: ${new Date(item.createdAt).toLocaleString()}
${title}: ${item.sheet_id?.title.oz || "Noma'lum"}
${total}: ${item.total || 0}
${total_corts}: ${item.total_corrects || 0}
${total_corts_score}: ${item.total_corrects_score || 0}`;
        });

        return formattedResults.join("\n\n");
    }
}

module.exports = new UsersAnsHelpers();