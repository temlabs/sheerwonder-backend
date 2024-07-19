type FilterValue = string | number | boolean | Date | undefined;

type InferFilterValues<T> = {
  [K in keyof T]: T[K] extends FilterValue ? T[K] : never;
}[keyof T];

export const createFilterQuery = <
  FilterObject extends Record<string, FilterValue>
>(
  filter: FilterObject
): [string, InferFilterValues<FilterObject>[]] => {
  const conditions: string[] = [];
  const values: InferFilterValues<FilterObject>[] = [];
  let paramIndex = 1;
  Object.entries(filter).forEach(([key, value], index) => {
    if (value !== undefined) {
      conditions.push(`${key} = $${paramIndex}`);
      values.push(value as InferFilterValues<FilterObject>);
      paramIndex++;
    }
  });

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  return [whereClause, values];
};
