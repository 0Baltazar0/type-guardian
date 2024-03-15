import {
  StringType,
  isPossibleFileType,
  isEnum,
} from "../../yaml-tools/schema/interface";

export function zodStringDefiner(root: StringType) {
  if (isPossibleFileType(root)) return "z.Any()";
  const enumt = isEnum(root);
  if (enumt) return `z.string().and(z.enum([${enumt.join(", ")}]))`;
  const buildChain: string[] = [];
  if (root.nullable) buildChain.push(`.nullable()`);
  if (root.minLength) buildChain.push(`.min(${root.minLength})`);
  if (root.maxLength) buildChain.push(`.length(${root.maxLength})`);
  if (root.format) buildChain.push(`.regex(/${root.format}/)`);

  return `z.string()${buildChain.join("")}`;
}
