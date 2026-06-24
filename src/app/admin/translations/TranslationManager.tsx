"use client"

import { useState, useTransition } from "react";
import { updateTranslations, deleteTranslationKey } from "@/lib/translation-actions";
import { toast } from "sonner";
import { Save, Plus, Trash2, Search, ArrowLeftRight, Folder } from "lucide-react";

interface TranslationItem {
  key: string;
  th: string;
  en: string;
}

interface TranslationManagerProps {
  initialTranslations: TranslationItem[];
}

const GROUP_LABELS: Record<string, string> = {
  all: "ทั้งหมด (All)",
  nav: "แถบเมนู (Navbar)",
  feature: "หน้าแรก (Home)",
  build: "บิลด์ตัวละคร (Builds)",
  general: "ทั่วไป (General)",
};

export default function TranslationManager({ initialTranslations }: TranslationManagerProps) {
  const [translations, setTranslations] = useState<TranslationItem[]>(initialTranslations);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isPending, startTransition] = useTransition();

  // New key inputs
  const [newKey, setNewKey] = useState("");
  const [newTh, setNewTh] = useState("");
  const [newEn, setNewEn] = useState("");

  const getGroup = (key: string): string => {
    const parts = key.split(".");
    return parts.length > 1 ? parts[0] : "general";
  };

  // Get unique groups present in the translations
  const availableGroups = ["all", ...Array.from(new Set(translations.map((t) => getGroup(t.key))))];

  const handleValueChange = (key: string, field: "th" | "en", value: string) => {
    setTranslations((prev) =>
      prev.map((item) => (item.key === key ? { ...item, [field]: value } : item))
    );
  };

  const handleAddNewKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) {
      toast.error("Please enter a translation key");
      return;
    }
    const cleanKey = newKey.trim().toLowerCase();
    if (translations.some((t) => t.key === cleanKey)) {
      toast.error("This key already exists");
      return;
    }

    const newItem: TranslationItem = {
      key: cleanKey,
      th: newTh,
      en: newEn,
    };

    setTranslations((prev) => [newItem, ...prev]);
    setNewKey("");
    setNewTh("");
    setNewEn("");
    toast.success(`Added key: ${cleanKey}`);
  };

  const handleSaveChanges = () => {
    startTransition(async () => {
      const res = await updateTranslations(translations);
      if (res.success) {
        toast.success("All translations saved successfully!");
      } else {
        toast.error(res.error || "Failed to save translations");
      }
    });
  };

  const handleDeleteKey = async (key: string) => {
    if (!confirm(`Are you sure you want to delete the key "${key}"?`)) return;

    startTransition(async () => {
      const res = await deleteTranslationKey(key);
      if (res.success) {
        setTranslations((prev) => prev.filter((item) => item.key !== key));
        toast.success(`Deleted key: ${key}`);
      } else {
        toast.error(res.error || "Failed to delete key");
      }
    });
  };

  const filteredTranslations = translations.filter((t) => {
    const matchesSearch =
      t.key.includes(search.toLowerCase()) ||
      t.th.toLowerCase().includes(search.toLowerCase()) ||
      t.en.toLowerCase().includes(search.toLowerCase());

    const matchesTab = activeTab === "all" || getGroup(t.key) === activeTab;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6 text-foreground">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent flex items-center gap-2">
            <ArrowLeftRight className="w-8 h-8 text-primary" />
            Translation Manager
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage site-wide bilingual translations (TH & EN) stored directly in JSON files.
          </p>
        </div>
        <button
          onClick={handleSaveChanges}
          disabled={isPending}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isPending ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {/* Tabs / Categories Selector */}
      <div className="flex flex-wrap gap-2 border-b border-border/40 pb-2">
        {availableGroups.map((group) => {
          const isActive = activeTab === group;
          const label = GROUP_LABELS[group] || `${group.toUpperCase()} Page`;
          return (
            <button
              key={group}
              onClick={() => setActiveTab(group)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
                isActive
                  ? "bg-primary border-primary text-primary-foreground shadow"
                  : "bg-card border-border/80 text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Add New Translation Form */}
      <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
          <Plus className="w-5 h-5" /> Add New Translation Key
        </h2>
        <form onSubmit={handleAddNewKey} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5 col-span-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Translation Key</label>
            <input
              type="text"
              placeholder={activeTab !== "all" ? `${activeTab}.key_name` : "e.g. nav.guides"}
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-full bg-accent/30 border border-border/80 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-1.5 col-span-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Thai (TH)</label>
            <input
              type="text"
              placeholder="บทความแนะนำ"
              value={newTh}
              onChange={(e) => setNewTh(e.target.value)}
              className="w-full bg-accent/30 border border-border/80 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-1.5 col-span-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">English (EN)</label>
            <input
              type="text"
              placeholder="Guides"
              value={newEn}
              onChange={(e) => setNewEn(e.target.value)}
              className="w-full bg-accent/30 border border-border/80 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent hover:bg-accent/80 border border-border font-bold px-4 py-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Key
          </button>
        </form>
      </div>

      {/* Translations Grid/Table */}
      <div className="space-y-4">
        {/* Search filter */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search translations in current tab (${GROUP_LABELS[activeTab] || activeTab})...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border/80 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
          />
        </div>

        {/* Translation Cards */}
        <div className="border border-border/80 bg-card rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 bg-accent/40 px-5 py-3 border-b border-border/80 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:grid">
            <div className="col-span-4">Key</div>
            <div className="col-span-4">Thai (TH)</div>
            <div className="col-span-3">English (EN)</div>
            <div className="col-span-1 text-center">Action</div>
          </div>

          <div className="divide-y divide-border/60">
            {filteredTranslations.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No translation keys found under this category.
              </div>
            ) : (
              filteredTranslations.map((item) => (
                <div
                  key={item.key}
                  className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 md:gap-0 px-5 py-4 hover:bg-accent/10 transition-colors"
                >
                  <div className="col-span-12 md:col-span-4 font-mono text-sm text-amber-500 font-semibold break-all">
                    {item.key}
                  </div>
                  <div className="col-span-12 md:col-span-4 md:pr-4">
                    <input
                      type="text"
                      value={item.th}
                      onChange={(e) => handleValueChange(item.key, "th", e.target.value)}
                      className="w-full bg-accent/15 hover:bg-accent/25 focus:bg-background border border-border/40 hover:border-border focus:border-primary/60 rounded-lg px-3 py-2 text-sm focus:outline-none transition-all"
                    />
                  </div>
                  <div className="col-span-12 md:col-span-3 md:pr-4">
                    <input
                      type="text"
                      value={item.en}
                      onChange={(e) => handleValueChange(item.key, "en", e.target.value)}
                      className="w-full bg-accent/15 hover:bg-accent/25 focus:bg-background border border-border/40 hover:border-border focus:border-primary/60 rounded-lg px-3 py-2 text-sm focus:outline-none transition-all"
                    />
                  </div>
                  <div className="col-span-12 md:col-span-1 flex justify-end md:justify-center">
                    <button
                      onClick={() => handleDeleteKey(item.key)}
                      disabled={isPending}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                      title="Delete translation key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
