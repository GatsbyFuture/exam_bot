class AdminHelpers {
    async polishingDeleteData(text) {
        const match = text.match(/#(categories|answers|sheets):\s*(\d{10})/);

        if (!match) {
            return null;
        }

        return {
            type: match[1],
            id: +match[2]
        };
    }
}

module.exports = new AdminHelpers();