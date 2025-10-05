// scripts/validate-json.mjs
import fs from "fs";
import path from "path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const cwd = process.cwd();
const dataDir = path.join(cwd, "data");
const schemaPath = path.join(dataDir, "taxonomy.schema.json");

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
const validate = ajv.compile(schema);

const files = fs
  .readdirSync(dataDir)
  .filter((f) => f.endsWith(".json") && !f.endsWith(".schema.json"));

let hasError = false;
for (const file of files) {
  const full = path.join(dataDir, file);
  const data = JSON.parse(fs.readFileSync(full, "utf-8"));
  const ok = validate(data);
  if (!ok) {
    hasError = true;
    console.error(`\n❌ ${file} failed validation:`);
    for (const err of validate.errors || []) {
      console.error(` - ${err.instancePath || "(root)"} ${err.message}`);
    }
  } else {
    console.log(`✅ ${file} is valid`);
  }
}

if (hasError) {
  console.error("\nValidation failed.");
  process.exit(1);
} else {
  console.log("\nAll JSON files are valid ✔");
}