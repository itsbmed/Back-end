module.exports = (page) => {
    let limit = 10;
    let offset = (page - 1) * limit;
    return { limit, offset };
};
