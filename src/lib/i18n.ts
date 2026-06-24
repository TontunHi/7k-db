import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

export type Locale = "th" | "en";

export async function getLocale(): Promise<Locale> {
  // Temporary lock: only English is allowed
  return "en";
}

export async function getTranslations(lang: Locale): Promise<Record<string, string>> {
  try {
    const filePath = path.join(process.cwd(), "src", "locales", `${lang}.json`);
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Failed to load translation for ${lang}:`, error);
    return {};
  }
}

/**
 * Server-side translation function
 */
export async function getT() {
  const lang = await getLocale();
  const translations = await getTranslations(lang);
  
  return (key: string, defaultValue?: string) => {
    return translations[key] || defaultValue || key;
  };
}
