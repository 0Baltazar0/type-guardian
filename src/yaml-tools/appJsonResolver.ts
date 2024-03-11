import { Preformatter } from "./preformatter";
import { YamlDict } from "./schema/interface";

export class ApplicationJson {
  constructor(source: Preformatter, entry: YamlDict) {}
}
export function ApplicationToJson(entry: YamlDict) {
  // $ref: "#/components/schemas/User"
  // components["schemas"]["User"]
  if ("$ref" in entry) {
    if (typeof entry["$ref"] !== "string")
      throw Error("$ref is not set properly" + entry["$ref"]);
    return (
      "components" +
      entry["$ref"]
        .split("/")
        .filter((_, i) => i > 1)
        .map((path) => `["${path}"]`)
        .join("")
    );
  }
  return JSON.stringify(
    Object.keys(entry).reduce((res, key) => {
      const resData = entry[key];
      if (typeof resData == "object" && !Array.isArray) {
      }
      return res;
    }, {})
  );
}
