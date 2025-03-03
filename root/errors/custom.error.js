module.exports = class CustomError extends Error {
    constructor(status, message, errors) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new CustomError(401, "User is not unauthorized");
    }

    static UserNotFoundError() {
        return new CustomError(404, "User not found");
    }

    // category
    static CategoryNotFoundError() {
        return new CustomError(404, "Category not found");
    }

    // test
    static SheetNotFoundError(message = "Sheet not found") {
        return new CustomError(404, message);
    }

    // answer
    static AnswersNotFoundError() {
        return new CustomError(404, "Answers not found");
    }

    static InCorrectDtoError(message = "Incorrect DTO") {
        return new CustomError(400, message);
    }

    static SaveDocumentsError(message = "Save Documents failed") {
        return new CustomError(500, message);
    }

    static InternalError() {
        return new CustomError(500, "Internal Server Error");
    }

    static DocumentNotFoundError(message = "Document not found") {
        return new CustomError(404, message);
    }

    static ReadingExcelError(message = "Reading Excel failed") {
        return new CustomError(500, message);
    }

    static UserAnswersError(status = 404, message = "Not found UserAnswers") {
        return new CustomError(status, message);
    }
};