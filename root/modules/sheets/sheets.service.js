const Sheet = require("./sheets.model");
const CustomError = require("../../core/errors/custom.error");

class SheetsService {
    async createSheet(sheet) {
        if (!sheet.position) {
            const count = await this.getCountSheets();
            sheet.position = count + 1;
        }
        return Sheet.create(sheet);
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

    async updateSheet(id, data) {
        const updated = await Sheet.findByIdAndUpdate(
            id,
            data,
            {new: true}
        ).lean();

        if (!updated) {
            throw CustomError.SheetNotFoundError();
        }
    }

    async deleteSheet(id) {
        const deleted = await Sheet.deleteOne({
            sheet_id: id
        });

        if (deleted.deletedCount === 0) {
            throw CustomError.SheetNotFoundError();
        }
    }

    async getRandomSheet() {
        const sheets = await Sheet.find({}, "_id");

        if (sheets.length === 0) {
            throw CustomError.SheetNotFoundError();
        }

        const random_id = sheets[Math.floor(Math.random() * sheets.length)]._id;

        return this.getByIdSheet(random_id);
    }
}

module.exports = new SheetsService();