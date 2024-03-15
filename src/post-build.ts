// add-shebang.js
import fs from "fs";
import path from "path";

const directoryPath = path.join(__dirname, "../", "dist");
const shebangLine = "#!/usr/bin/env node\n";

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  files.forEach((file) => {
    if (path.extname(file) === ".js") {
      const filePath = path.join(directoryPath, file);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const updatedContents = shebangLine + fileContents;

      fs.writeFileSync(filePath, updatedContents, "utf8");
      console.log(`Added shebang to ${file}`);
    }
  });
});
