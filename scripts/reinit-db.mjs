
import mysql from "mysql2/promise";
import { initDB } from "../src/lib/db.js";

async function reinit() {
  const connectionConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: false
    }
  };

  const dbName = process.env.DB_NAME || "7k_db";

  try {
    console.log(`Connecting to ${connectionConfig.host}...`);
    const connection = await mysql.createConnection(connectionConfig);
    
    console.log(`Ensuring database '${dbName}' exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.end();

    console.log(`Database '${dbName}' is ready. Initializing tables...`);
    await initDB();
    
    console.log("Database re-initialization successful.");
    process.exit(0);
  } catch (err) {
    console.error("Failed to re-initialize database:", err);
    process.exit(1);
  }
}

reinit();
