import { NumberType } from "../../yaml-tools/schema/interface";
export function zodNumberDefiner(root: NumberType) {
  const buildChain: string[] = [];

  if (root.format) {
    switch (root.format) {
      case "float":
      case "double":
    }
    // Makes no difference, but kept as reminder for future reference.
    buildChain.push("z.number('Value must be a number!')");
  } else {
    buildChain.push("z.number('Value must be a number!')");
  }

  if (root.nullable) buildChain.push(".nullable()");
  if (root.exclusiveMaximum)
    buildChain.push(
      `.refine(zodLTRefine(${root.exclusiveMaximum}),{message:"Value must be less than ${root.exclusiveMaximum}"})`
    );
  if (root.exclusiveMinimum)
    buildChain.push(
      `.refine(zodGTRefine(${root.exclusiveMinimum}),{message:"Value must be more than ${root.exclusiveMinimum}"})`
    );
  if (root.maximum)
    buildChain.push(
      `.max(${root.maximum},"Value must be less or equal to ${root.maximum}")`
    );
  if (root.minimum)
    buildChain.push(
      `.max(${root.minimum},"Value must be more or equal to ${root.minimum}")`
    );
  if (root.multipleOf) buildChain.push(`.multipleOf(${root.multipleOf})`);
  return `${buildChain.join("")}`;
}
