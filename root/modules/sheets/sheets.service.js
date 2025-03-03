const Sheet = require("./sheets.model");
const CustomError = require("../../errors/custom.error");

class SheetsService {
    async createSheet(sheet) {
        if (!sheet.position) {
            const count = await this.getCountSheets();
            sheet.position = count + 1;
        }

        const newSheet = await Sheet.create(sheet);

        return newSheet.sheet_id;
    }

    async getSheetWithFilter(query) {
        return Sheet.find(query).sort({position: 1}).lean();
    }

    async getBySheetId(id) {
        return Sheet.findOne({
            sheet_id: id
        }).lean();
    }

    async getByIdSheet(id) {
        return Sheet.findById(id).lean();
    }

    async getCountSheets() {
        return Sheet.countDocuments();
    }

    async updateSheet(filter, data) {
        const result = await Sheet.updateOne(
            filter,
            {$set: data}
        );

        if (result.matchedCount === 0) {
            throw CustomError.SheetNotFoundError();
        }
    }

    async getRandomSheet() {
        const sheets = await Sheet.aggregate([
            {
                $sample: {size: 1}
            }
        ]);

        if (!sheets.length) {
            return null;
        }

        return sheets[0];
    }

    async deleteSheet(id) {
        const deleted = await Sheet.deleteOne({
            sheet_id: id
        });

        if (deleted.deletedCount === 0) {
            throw CustomError.SheetNotFoundError();
        }
    }
}

module.exports = SheetsService;