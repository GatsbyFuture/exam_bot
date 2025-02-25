const Answers = require("./answers.model");
const SheetsService = require("../sheets/sheets.service");
const CustomError = require("../../core/errors/custom.error");

class AnswersService {
    sheetsService = new SheetsService();

    async createAnswersByHand(answers) {
        if (!answers.position) {
            const count = await this.getCountAnswers();
            answers.position = count + 1;
        }
        return Answers.create(answers);
    }

    async createAnswersByExcel(variants) {
        const sheetIds = Object.keys(variants).map(Number);
        console.log(sheetIds);
        const sheets = await this.sheetsService.getSheetWithFilter({
            sheet_id: {
                $in: sheetIds
            }
        });

        if (!sheets.length) {
            throw CustomError.SheetNotFoundError();
        }

        const map = new Map(sheets.map(sheet => [sheet.sheet_id, sheet._id]));

        let count = await this.getCountAnswers();
        let newCount = 0;

        for (const id of sheetIds) {
            const variant = variants[id];
            newCount += 1;
            const hasScore = variant.data.some(row => row.score.some(score => score > 0));
            console.log(variant.data);
            const newAnswers = new Answers({
                answers: variant.data,
                has_score: hasScore,
                sheet_id: map.get(id),
                sheet: id,
                position: count + newCount,
            });
            await newAnswers.save();
        }

        return newCount;
    }

    async getAnswersWithFilter(query) {
        const answers = await Answers.find(query)
            .populate({
                path: "sheet_id",
                select: "title"
            })
            .lean();

        if (!answers.length) {
            throw CustomError.AnswersNotFoundError();
        }

        return answers;
    }

    async getAnswersWithSheetId(sheetId) {
        return Answers.find({
            sheet: sheetId
        }).lean();
    }

    async getByIdAnswer(id) {
        return Answers.findById(id).lean();
    }

    async getAnswersOne(answers_id) {
        return Answers.findOne({
            answers_id: answers_id
        }).populate({
            path: "sheet_id",
            select: "title"
        }).lean();
    }

    async getCountAnswers() {
        return Answers.countDocuments();
    }

    async updateAnswers(id, data) {
        const updated = await Answers.findByIdAndUpdate(
            id,
            data,
            {new: true}
        ).lean();

        if (!updated) {
            throw CustomError.AnswersNotFoundError();
        }
    }

    async deleteAnswer(id) {
        const deleted = await Answers.deleteOne({
            answers_id: id
        });

        if (deleted.deletedCount === 0) {
            throw CustomError.AnswersNotFoundError();
        }
    }
}

module.exports = AnswersService;