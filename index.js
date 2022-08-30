/**
 * This script generates an Open Source Dependencies file, as required by Twilio's Open Source Software Release Approval.
 */

const fs = require("fs");
require('dotenv').config()
const NpmApi = require("npm-api");
const npm = new NpmApi();

//TODO: Fill these out ===============
  const PACKAGE_JSON_FILE_PATH = process.env.PACKAGE_JSON_FILE_PATH
  const OUTPUT_FILE_PATH= process.env.OUTPUT_FILE_PATH
//=====================================

fs.readFile(PACKAGE_JSON_FILE_PATH, "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const packages = JSON.parse(data);

  const deps = Object.keys(packages.dependencies);

  const results = [];
  const promises = deps
    .reduce((arr, curr) => {
      return arr.concat(npm.repo(curr));
    }, [])
    .map((repo) =>
      repo.package().then(({ name, version, license, homepage }) => {
        results.push({
          name,
          version,
          license,
          url: homepage,
        });
      })
    );
  Promise.all(promises).then(() => {
    const beautifiedText = results.reduce(
      (text, { name, version, license, url }) =>
        `${text}\nName:${name}, Version: ${version}, License: ${license}, URL: ${url}`,
      ""
    );
    fs.writeFile(OUTPUT_FILE_PATH, beautifiedText, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Successfully wrote file.");
    });
  });
});
