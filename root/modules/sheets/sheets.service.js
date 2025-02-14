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

    async getAllSheets() {
        return Sheet.find({
            is_public: true,
            is_active: true
        }).sort({position: 1}).lean();
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
            throw CustomError.CategoryNotFoundError();
        }
    }

    async deleteSheet(id) {
        const deleted = await Sheet.findByIdAndDelete(id).lean();

        if (!deleted) {
            throw CustomError.CategoryNotFoundError();
        }
    }
}

module.exports = new SheetsService();