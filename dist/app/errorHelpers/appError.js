class AppError extends Error {
    statusCode;
    constructor(statuscode, message, stack = '') {
        super(message);
        this.statusCode = statuscode;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export default AppError;
//# sourceMappingURL=appError.js.map