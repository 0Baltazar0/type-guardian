import {
  StringType,
  isPossibleFileType,
  isEnum,
} from "../../yaml-tools/schema/interface";

export function zodStringDefiner(root: StringType) {
  // Files may be parsed in the future.
  if (isPossibleFileType(root)) return "z.any()";
  const enumt = isEnum(root);
  if (enumt)
    return `z.string("Value must be text!").and(z.enum([${enumt.join(
      ", "
    )}],"Value must be one ${enumt.join("|")}"))`;
  const buildChain: string[] = [];
  if (root.nullable) buildChain.push(`.nullable()`);
  if (root.minLength)
    buildChain.push(
      `.min(${root.minLength},"The minimun length for this text is ${root.minLength}")`
    );
  if (root.maxLength)
    buildChain.push(
      `.length(${root.maxLength},"The maximum length for this text is ${root.maxLength}")`
    );
  if (root.format)
    buildChain.push(
      `.regex(/${root.format}/,"This text does not meet the required format.")`
    );

  return `z.string("Value must be text!")${buildChain.join("")}`;
}
