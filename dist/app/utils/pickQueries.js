export const pickQueries = (obj, keys) => {
    const finalObject = {};
    for (let key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            finalObject[key] = obj[key];
        }
    }
    return finalObject;
};
//# sourceMappingURL=pickQueries.js.map