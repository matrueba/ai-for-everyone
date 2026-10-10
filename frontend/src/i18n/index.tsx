import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { es } from "./locales/es";
import { en } from "./locales/en";
import type { Dict } from "./dict";

export type Lang = "es" | "en";

export const LANGS: Lang[] = ["es", "en"];

const DICTIONARIES: Record<Lang, Dict> = { es, en };

/** BCP 47 tags used for `Intl` formatting and the `<html lang>` attribute. */
const LOCALES: Record<Lang, string> = { es: "es-ES", en: "en-US" };

const STORAGE_KEY = "aife.lang";

const isLang = (value: unknown): value is Lang => value === "es" || value === "en";

/**
 * `?lang=` wins (so a link can pin a language), then the stored preference,
 * then the browser. Everything else falls back to English.
 */
function detectLang(): Lang {
    if (typeof window === "undefined") return "en";

    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (isLang(fromUrl)) return fromUrl;

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (isLang(stored)) return stored;
    } catch {
        // localStorage can throw in private/blocked contexts — fall through.
    }

    return window.navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
}

interface I18nContextValue {
    lang: Lang;
    setLang: (lang: Lang) => void;
    /** BCP 47 tag for the active language, e.g. `es-ES`. */
    locale: string;
    t: Dict;
    /** Locale-aware number formatting (decimal separator, grouping, currency). */
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lang, setLangState] = useState<Lang>(detectLang);

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    const setLang = useCallback((next: Lang) => {
        setLangState(next);
        try {
            window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // Preference just won't persist; not worth failing over.
        }
    }, []);

    const value = useMemo<I18nContextValue>(() => {
        const locale = LOCALES[lang];
        return {
            lang,
            setLang,
            locale,
            t: DICTIONARIES[lang],
            formatNumber: (value, options) => new Intl.NumberFormat(locale, options).format(value),
        };
    }, [lang, setLang]);

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nContextValue {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
    return ctx;
}

/** Returns a single namespace of the active dictionary, e.g. `useT("train")`. */
export function useT<K extends keyof Dict>(namespace: K): Dict[K] {
    return useI18n().t[namespace];
}
