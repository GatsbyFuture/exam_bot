const Answers = require("./answers.model");
const SheetsService = require("../sheets/sheets.service");
const CustomError = require("../../errors/custom.error");

class AnswersService {
    sheetsService = new SheetsService();

    async createAnswersByHand(answers) {
        const hasSheet = await this.sheetsService.getBySheetId(answers.sheet);

        if (!hasSheet) {
            throw CustomError.SheetNotFoundError();
        }

        answers.sheet_id = hasSheet._id;

        await this.sheetsService.updateSheet(
            {_id: hasSheet._id},
            {has_answers: true}
        );

        if (!answers.position) {
            const count = await this.getCountAnswers();
            answers.position = count + 1;
        }

        const newAnswers = await Answers.create(answers);

        return newAnswers.answers_id;
    }

    async createAnswersByExcel(variants) {
        const sheetIds = Object.keys(variants).map(Number);

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
            const sheet_id = map.get(id);
            newCount += 1;
            const hasScore = variant.data.some(row => row.score.some(score => score > 0));

            const newAnswers = new Answers({
                answers: variant.data,
                has_score: hasScore,
                sheet_id: sheet_id,
                sheet: id,
                position: count + newCount,
            });

            await newAnswers.save();

            await this.sheetsService.updateSheet(
                {_id: sheet_id},
                {has_answers: true}
            );
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