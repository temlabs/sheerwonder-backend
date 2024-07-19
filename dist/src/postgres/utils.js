"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFilterQuery = void 0;
const createFilterQuery = (filter) => {
    const conditions = [];
    const values = [];
    let paramIndex = 1;
    Object.entries(filter).forEach(([key, value], index) => {
        if (value !== undefined) {
            conditions.push(`${key} = $${paramIndex}`);
            values.push(value);
            paramIndex++;
        }
    });
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    return [whereClause, values];
};
exports.createFilterQuery = createFilterQuery;
