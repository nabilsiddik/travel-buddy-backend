export const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: 'route not found.'
    });
};
//# sourceMappingURL=notFound.js.map