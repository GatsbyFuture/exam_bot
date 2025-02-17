const Answers = require("./answers.model");
const CustomError = require("../../core/errors/custom.error");

class AnswersService {
    async createAnswer(answer) {
        if (!answer.position) {
            const count = await this.getCountAnswers();
            answer.position = count + 1;
        }
        return Answers.create(answer);
    }

    async getAllAnswers() {
        return Answers.find()
            .populate({
                path: "sheet_id",
                select: "title"
            })
            .lean();
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

    async deleteAnswers(id) {
        const deleted = await Answers.deleteOne({
            answers_id: id
        });

        if (deleted.deletedCount === 0) {
            throw CustomError.AnswersNotFoundError();
        }
    }
}

module.exports = new AnswersService();