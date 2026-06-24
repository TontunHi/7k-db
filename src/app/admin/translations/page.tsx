import { requireAdmin } from "@/lib/auth-guard";
import { getAllTranslationsForAdmin } from "@/lib/translation-actions";
import TranslationManager from "./TranslationManager";

export const metadata = {
  title: "Translation Manager | Admin Command Center",
  description: "Translate UI text labels and headers for Thai and English.",
};

export default async function AdminTranslationsPage() {
  // Ensure the user is an authorized admin
  await requireAdmin();

  // Load current translations from th.json and en.json
  const translations = await getAllTranslationsForAdmin();

  return <TranslationManager initialTranslations={translations} />;
}
