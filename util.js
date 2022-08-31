const fs = require("fs");
require("dotenv").config();
const NpmApi = require("npm-api");
const npm = new NpmApi();
const set = new Set();

const { IGNORE_DIRS, OUTPUT_FILE_PATH } = process.env;

function traverseFileTree(dir) {
  fs.readdir(dir, "utf8", (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    if (files.includes("package.json")) {
      console.log(`Found dependencies at ${dir}/package.json`);
      makeDependencies(dir);
    }

    files.forEach((file) => {
      if (
        fs.lstatSync(`${dir}/${file}`).isDirectory() &&
        !(IGNORE_DIRS || []).includes(file)
      ) {
        traverseFileTree(`${dir}/${file}`);
      }
    });
  });
}

function makeDependencies(dir) {
  fs.readFile(`${dir}/package.json`, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const packages = JSON.parse(data);

    if (!packages.dependencies) return;

    const deps = Object.keys(packages.dependencies);

    const results = [];
    const promises = deps
      .reduce((arr, curr) => {
        if (!set.has(curr)) {
          set.add(curr);
          return arr.concat(npm.repo(curr));
        }
        return arr;
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
      fs.writeFile(OUTPUT_FILE_PATH, beautifiedText, { flag: "a+" }, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    });
  });
}

module.exports = {
  traverseFileTree,
  makeDependencies,
};
