import { BooleanType } from "../../yaml-tools/schema/interface";
export function zodBooleanDefiner(root: BooleanType) {
  const buildChain: string[] = [];
  if (root.nullable) buildChain.push(".nullable()");

  return `z.boolean()${buildChain.join("")}`;
}
