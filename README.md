# oss-dependency-generator
Generates dependencies information per Twilio's Open Source Software Release Approval requirements.

## Usage
- Update two variables in the `.env.` file:
  - Change `PACKAGE_JSON_FILE_PATH` to be the the package.json file you wish to create dependency descriptions from.
  - Change `OUTPUT_FILE_PATH` to be where to put the genereated dependecy descriptions file.
- Run `npm install`.
- Run `node index.js` to start the script.