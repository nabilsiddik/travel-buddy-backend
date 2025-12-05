declare class AppError extends Error {
    statusCode: number;
    constructor(statuscode: number, message: string, stack?: string);
}
export default AppError;
//# sourceMappingURL=appError.d.ts.map