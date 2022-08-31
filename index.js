/**
 * This script generates an Open Source Dependencies file, as required by Twilio's Open Source Software Release Approval.
 */
const { traverseFileTree } = require("./util");
const { assert } = require("console");
const fs = require("fs");
const { emitWarning } = require("process");
const { unlink } = fs.promises;
const { PROJECT_ROOT, IGNORE_DIRS, OUTPUT_FILE_PATH } = process.env;

assert(PROJECT_ROOT, "PROJECT_ROOT was not defined in .env!");
assert(OUTPUT_FILE_PATH, "OUTPUT_FILE_PATH was not defined in .env!");

if (!IGNORE_DIRS)
  emitWarning(
    "IGNORE_DIRS was undefined, this means node_modules and other potentially unwanted package.json files may be included in your dependency list."
  );

new Promise((resolve, reject) =>
  fs.existsSync(OUTPUT_FILE_PATH)
    ? resolve(unlink(OUTPUT_FILE_PATH))
    : resolve()
).then(() => traverseFileTree(PROJECT_ROOT));
