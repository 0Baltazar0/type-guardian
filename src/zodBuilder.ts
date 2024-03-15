import { parseArgs } from "node:util";
import { argv } from "node:process";
import { ZodBundler } from "./bundle-zod/ZodBundler";

const options = {
  input: { type: "string", short: "i" },
  output: { type: "string", short: "o" },
  bundler: { type: "boolean", short: "b" },
} as const;
console.log(argv);
const { values, positionals } = parseArgs({
  args: argv.filter((el, index) => index > 0),
  options,
  allowPositionals: true,
});
if (!values.input || !values.output)
  throw Error("Must set input -i  and output -o");
ZodBundler.from_file_or_files(values.input, values.output, "./cache").then(
  (bundlers) => {
    bundlers.forEach((b) => b.compile());
  }
);
// console.log(join("./local/file.yaml", "../file2.json"));
