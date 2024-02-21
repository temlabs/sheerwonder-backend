"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQueryStringSchema = exports.getWhereConditionsFromFilter = void 0;
const getWhereConditionsFromFilter = (filters, filterSchema, startValueCountFrom = 0) => {
    const filterKeys = Object.keys(filters);
    if (filterKeys.length === 0) {
        return [];
    }
    const queryArray = filterKeys.map((key, index) => {
        const operation = filterSchema[key].operation;
        const columnName = filterSchema[key].dbColumn;
        const placeholderIndex = index + 1 + startValueCountFrom;
        return `${columnName} ${operation} $${placeholderIndex}`;
    });
    return queryArray;
};
exports.getWhereConditionsFromFilter = getWhereConditionsFromFilter;
const generateQueryStringSchema = (filterSchema) => {
    const properties = {};
    const filterKeys = Object.keys(filterSchema);
    filterKeys.forEach((key) => {
        properties[key] = { type: filterSchema[key].type };
    });
    const schema = {
        type: "object",
        properties: Object.assign(Object.assign({}, properties), { sort_by: { type: "string" }, offset: { type: "number" } }),
        additionalProperties: false,
    };
    return schema;
};
exports.generateQueryStringSchema = generateQueryStringSchema;
