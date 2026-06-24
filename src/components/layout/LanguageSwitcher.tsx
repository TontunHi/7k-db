"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function LanguageSwitcher() {
  const router = useRouter();
  // Force EN active state
  const [currentLang, setCurrentLang] = useState<"th" | "en">("en");

  useEffect(() => {
    // Force set to EN since TH is temporarily locked
    setCurrentLang("en");
  }, []);

  const switchLanguage = (lang: "th" | "en") => {
    // Only EN is allowed to be switched to for now
    if (lang !== "en" || lang === currentLang) return;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = `lang=${lang};path=/;expires=${expires.toUTCString()}`;
    
    setCurrentLang(lang);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1.5 bg-accent/40 rounded-lg p-1 border border-border/40 text-xs font-bold">
      <button
        disabled
        className="px-2 py-1 rounded transition-all text-muted-foreground/40 bg-transparent flex items-center gap-1 cursor-not-allowed"
        title="Thai language is temporarily locked"
      >
        TH
        <Lock className="w-2.5 h-2.5" />
      </button>
      <button
        onClick={() => switchLanguage("en")}
        className="px-2 py-1 rounded transition-all bg-primary text-primary-foreground shadow"
      >
        EN
      </button>
    </div>
  );
}
