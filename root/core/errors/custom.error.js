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

    static InCorrectDtoError(message) {
        return new CustomError(400, message);
    }

    static InternalError() {
        return new CustomError(500, "Internal Server Error");
    }
};