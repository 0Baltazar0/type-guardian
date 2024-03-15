export function zodGTRefine<D extends any>(
  number: number
): (data: number) => any {
  return (data) => {
    // Data must match exactly one schema
    return number < data;
  };
}
export function zodLTRefine<D extends any>(
  number: number
): (data: number) => any {
  return (data) => {
    // Data must match exactly one schema
    return number > data;
  };
}
