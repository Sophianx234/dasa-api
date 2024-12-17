import fs from "fs";
import { dirname } from "path";
import { exit } from "process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const users = JSON.parse(fs.readFileSync(`${__dirname}/user.json`, "utf-8"));

async function importData() {
  try {
    console.log("boruto");
    // User.create(users)
  } catch (err) {
    console.log(err);
  }
}

if (process.argv[2] === "--import") {
  console.log("Boruto");
  exit();
}
