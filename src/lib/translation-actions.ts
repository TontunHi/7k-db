'use server'

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth-guard";
import { type ActionResponse } from "./types";
import { type Locale } from "./i18n";

/**
 * Get all translations (both TH and EN) formatted for the admin edit table
 */
export async function getAllTranslationsForAdmin() {
  await requireAdmin();

  try {
    const thPath = path.join(process.cwd(), "src", "locales", "th.json");
    const enPath = path.join(process.cwd(), "src", "locales", "en.json");

    const thContent = await fs.readFile(thPath, "utf-8");
    const enContent = await fs.readFile(enPath, "utf-8");

    const thJson = JSON.parse(thContent);
    const enJson = JSON.parse(enContent);

    // Combine keys to build full list
    const keys = Array.from(new Set([...Object.keys(thJson), ...Object.keys(enJson)]));

    return keys.map((key) => ({
      key,
      th: thJson[key] || "",
      en: enJson[key] || "",
    }));
  } catch (error) {
    console.error("Error reading translation files for admin:", error);
    throw new Error("Failed to load translation files");
  }
}

/**
 * Update translation files directly
 */
export async function updateTranslations(
  updates: { key: string; th: string; en: string }[]
): Promise<ActionResponse> {
  await requireAdmin();

  try {
    const thPath = path.join(process.cwd(), "src", "locales", "th.json");
    const enPath = path.join(process.cwd(), "src", "locales", "en.json");

    const thContent = await fs.readFile(thPath, "utf-8");
    const enContent = await fs.readFile(enPath, "utf-8");

    const thJson = JSON.parse(thContent);
    const enJson = JSON.parse(enContent);

    // Apply updates
    for (const update of updates) {
      if (!update.key) continue;
      thJson[update.key] = update.th;
      enJson[update.key] = update.en;
    }

    // Write back sorted by key for clean git diffs
    const sortedTh: Record<string, string> = {};
    const sortedEn: Record<string, string> = {};

    Object.keys(thJson).sort().forEach(k => sortedTh[k] = thJson[k]);
    Object.keys(enJson).sort().forEach(k => sortedEn[k] = enJson[k]);

    await fs.writeFile(thPath, JSON.stringify(sortedTh, null, 2), "utf-8");
    await fs.writeFile(enPath, JSON.stringify(sortedEn, null, 2), "utf-8");

    revalidatePath("/", "layout");
    revalidatePath("/admin/translations");

    return { success: true };
  } catch (error) {
    console.error("Failed to update translations:", error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * Delete a translation key
 */
export async function deleteTranslationKey(key: string): Promise<ActionResponse> {
  await requireAdmin();

  try {
    const thPath = path.join(process.cwd(), "src", "locales", "th.json");
    const enPath = path.join(process.cwd(), "src", "locales", "en.json");

    const thContent = await fs.readFile(thPath, "utf-8");
    const enContent = await fs.readFile(enPath, "utf-8");

    const thJson = JSON.parse(thContent);
    const enJson = JSON.parse(enContent);

    delete thJson[key];
    delete enJson[key];

    await fs.writeFile(thPath, JSON.stringify(thJson, null, 2), "utf-8");
    await fs.writeFile(enPath, JSON.stringify(enJson, null, 2), "utf-8");

    revalidatePath("/", "layout");
    revalidatePath("/admin/translations");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete translation key:", error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
