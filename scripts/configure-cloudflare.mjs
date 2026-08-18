import { readFile, writeFile } from "node:fs/promises";

const listPath = process.argv[2];
if (!listPath) {
  throw new Error("Pass the path to the Wrangler D1 list JSON file.");
}

const databases = JSON.parse(await readFile(listPath, "utf8"));
const database = databases.find((item) => item.name === "murchip-leads");

if (!database?.uuid) {
  throw new Error("The murchip-leads D1 database was not found.");
}

const config = {
  $schema: "./node_modules/wrangler/config-schema.json",
  name: "murchip-robocats",
  pages_build_output_dir: "./public",
  compatibility_date: "2026-08-18",
  d1_databases: [
    {
      binding: "LEADS_DB",
      database_name: "murchip-leads",
      database_id: database.uuid,
      migrations_dir: "./migrations",
    },
  ],
};

await writeFile("wrangler.jsonc", `${JSON.stringify(config, null, 2)}\n`);
console.log(`Configured LEADS_DB (${database.uuid}).`);
