"use client";

import { useI18n, type Locale } from "@/lib/i18n";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const LOCALE_OPTIONS: { value: Locale; label: string; flag: string }[] = [
  { value: "ja", label: "日本語", flag: "🇯🇵" },
  { value: "ko", label: "한국어", flag: "🇰🇷" },
  { value: "en", label: "English", flag: "🇺🇸" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = LOCALE_OPTIONS.find((o) => o.value === locale)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        title={current.label}
      >
        <Globe className="w-4 h-4" />
        <span className="text-xs">{current.flag}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-popover border border-border rounded-lg shadow-lg py-1 z-50">
          {LOCALE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setLocale(option.value);
                setIsOpen(false);
              }}
              className={`flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left ${
                option.value === locale
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              }`}
            >
              <span>{option.flag}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
