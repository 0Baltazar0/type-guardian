import { IntegerType } from "../../yaml-tools/schema/interface";
export function zodIntegerDefiner(root: IntegerType) {
  const buildChain: string[] = [];
  if (root.format) {
    switch (root.format) {
      case "int32":
        buildChain.push(
          "z.number('Value must be a number!').int('Value must be a whole number !')"
        );
        break;
      case "int64":
        buildChain.push("z.bigint('Value must be a number!)");
        break;
    }
  } else {
    buildChain.push(
      "z.number('Value must be a number!').int('Value must be a whole number !')"
    );
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
