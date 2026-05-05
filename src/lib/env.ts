import { z } from "zod";

const envSchema = z.object({
  // Database
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().default(3306),
  DB_USER: z.string().default("root"),
  DB_PASSWORD: z.string().default(""),
  DB_NAME: z.string().default("7k-db"),
  DB_SSL: z.preprocess((val) => val === "true", z.boolean()).default(false),
  DB_DEBUG: z.preprocess((val) => val === "true", z.boolean()).default(false),

  // Auth & Security
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters long"),
  ADMIN_USER: z.string().default("admin"),
  ADMIN_PASSWORD: z.string().min(8, "ADMIN_PASSWORD must be at least 8 characters long"),
  ANALYTICS_SALT: z.string().default("7k-tracker-secret"),

  // Environment
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
