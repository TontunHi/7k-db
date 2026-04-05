
import { initDB } from "../src/lib/db.js";

async function run() {
  console.log("Starting DB Initialization...");
  await initDB();
  console.log("DB Initialization Complete.");
  process.exit(0);
}

run().catch(err => {
  console.error("Failed to initialize DB:", err);
  process.exit(1);
});
