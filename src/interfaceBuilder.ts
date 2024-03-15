import { parseArgs } from "node:util";
import { argv } from "node:process";
import { basename, join, extname } from "path";
import { InterfaceBundler } from "./bundle-interface/interfaceBundler";

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
InterfaceBundler.from_file_or_files(
  values.input,
  values.output,
  "./cache"
).then((bundlers) => {
  bundlers.forEach((b) => b.compile());
});
