import { ZodTypeAny } from "zod";
export function zodXorRefine<T extends ZodTypeAny[], D extends any>(
  ...schemas: T
): (data: D) => any {
  return (data) => {
    // Count how many schemas the data matches
    const matchCount = schemas.reduce(
      (acc, schema) => acc + (schema.safeParse(data).success ? 1 : 0),
      0
    );

    // Data must match exactly one schema
    return matchCount === 1;
  };
}
