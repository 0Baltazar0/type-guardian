import { IntegerType } from "../../yaml-tools/schema/interface";
export function zodIntegerDefiner(root: IntegerType) {
  const buildChain: string[] = [];
  if (root.nullable) buildChain.push(".nullable()");
  if (root.exclusiveMaximum)
    buildChain.push(`.refine(zodLTRefine(${root.exclusiveMaximum}))`);
  if (root.exclusiveMinimum)
    buildChain.push(`.refine(zodGTRefine(${root.exclusiveMinimum}))`);
  if (root.maximum) buildChain.push(`.max(${root.maximum})`);
  if (root.minimum) buildChain.push(`.max(${root.minimum})`);
  if (root.multipleOf) buildChain.push(`.multipleOf(${root.multipleOf})`);
  return `z.number().int()${buildChain.join("")}`;
}
