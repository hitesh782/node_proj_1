const MATCH_MODES = require("./constants");

const buildFilterQuery = (filters) => {
    const query = {};
    for (const key in filters) {
        const { value, matchMode } = filters[key];
        switch (matchMode) {
            case MATCH_MODES.IS:
                query[key] = value;
                break;
            case MATCH_MODES.CONTAINS:
                query[key] = { $regex: value, $options: 'i' };
                break;
            case MATCH_MODES.IN:
                query[key] = { $in: value };
                break;
            case MATCH_MODES.GT:
                query[key] = { $gt: value };
                break;
            case MATCH_MODES.GTE:
                query[key] = { $gte: value };
                break;
            case MATCH_MODES.LT:
                query[key] = { $lt: value };
                break;
            case MATCH_MODES.LTE:
                query[key] = { $lte: value };
                break;
            default:
                break;
        }
    }
    return query;
};

module.exports = buildFilterQuery;
