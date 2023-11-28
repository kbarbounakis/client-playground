import fs from "fs";

const buffer = fs.readFileSync("README.md");
console.log(buffer.toString());
