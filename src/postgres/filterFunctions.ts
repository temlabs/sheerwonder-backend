import { FilterSchema } from "./filterTypes";

export const getWhereConditionsFromFilter = <RowType, FilterKey extends string>(
  filters: { [key in FilterKey]: string },
  filterSchema: FilterSchema<RowType, FilterKey>,
  startValueCountFrom: number = 0
): string[] => {
  const filterKeys = Object.keys(filters) as FilterKey[];
  if (filterKeys.length === 0) {
    return [];
  }

  const queryArray = filterKeys.map((key, index) => {
    const operation = filterSchema[key].operation;
    const columnName = filterSchema[key].dbColumn as string;
    const placeholderIndex = index + 1 + startValueCountFrom;
    return `${columnName} ${operation} $${placeholderIndex}`;
  });
  return queryArray;
};

export const generateQueryStringSchema = <RowType, FilterKey extends string>(
  filterSchema: FilterSchema<RowType, FilterKey>
) => {
  const properties = {} as {
    [key in FilterKey]: { type: "string" | "number" | "boolean" };
  };
  const filterKeys = Object.keys(filterSchema) as FilterKey[];
  filterKeys.forEach((key: FilterKey) => {
    properties[key] = { type: filterSchema[key].type };
  });

  const schema = {
    type: "object",
    properties: {
      ...properties,
      sort_by: { type: "string" },
      offset: { type: "number" },
    },
    additionalProperties: false,
  };

  return schema;
};
