// Validate request according to the zod schema
const validateRequest = (zodSchema) => async (req, res, next) => {
    try {
        let data = req.body;
        if (typeof req.body?.data === 'string') {
            data = JSON.parse(req.body?.data);
        }
        await zodSchema.parseAsync(data);
        req.body = data;
        return next();
    }
    catch (err) {
        next(err);
    }
};
export default validateRequest;
//# sourceMappingURL=validateRequest.js.map