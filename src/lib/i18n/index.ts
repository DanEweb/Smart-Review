"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import React from "react";
import type { TranslationKeys } from "./types";
import ja from "./locales/ja";
import ko from "./locales/ko";
import en from "./locales/en";

export type Locale = "ja" | "ko" | "en";

const locales: Record<Locale, TranslationKeys> = { ja, ko, en };

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "ja",
  setLocale: () => {},
  t: ja,
});

const STORAGE_KEY = "smart-review-locale";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ja");

  // Load saved locale from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && locales[saved]) {
        setLocaleState(saved);
      }
    } catch {
      // localStorage not available (SSR)
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {
      // localStorage not available
    }
    // Update html lang attribute
    document.documentElement.lang = newLocale;
  }, []);

  const value: I18nContextValue = {
    locale,
    setLocale,
    t: locales[locale],
  };

  return React.createElement(I18nContext.Provider, { value }, children);
}

export function useI18n() {
  return useContext(I18nContext);
}

export { type TranslationKeys };
