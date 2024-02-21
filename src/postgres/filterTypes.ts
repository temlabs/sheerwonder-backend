export type FilterSchema<RowType, FilterKey extends string> = {
  [key in FilterKey]: {
    operation: FILTER_OPERATION;
    type: "string" | "number" | "boolean";
    dbColumn: keyof RowType | "offset";
  };
};

export enum FILTER_OPERATION {
  LESS_THAN_EQ = "<=",
  LESS_THAN = "<",
  MORE_THAN_EQ = ">=",
  MORE_THAN = ">",
  EQ = "=",
  LIKE = "LIKE",
}

export type SortBy = "date" | "popularity";
