import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Theme = "light" | "dark";
/** Kept as an alias: components that only care about the applied theme use it. */
export type ResolvedTheme = Theme;

export const THEMES: Theme[] = ["light", "dark"];

/** Must match the inline script in index.html, which applies the theme before first paint. */
const STORAGE_KEY = "aife.theme";

const DEFAULT_THEME: Theme = "light";

/** Anything other than an explicit "dark" (including the old "system" value) means light. */
function readTheme(): Theme {
    try {
        if (window.localStorage.getItem(STORAGE_KEY) === "dark") return "dark";
    } catch {
        // Blocked storage: fall back to the default.
    }
    return DEFAULT_THEME;
}

interface ThemeContextValue {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(readTheme);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    const setTheme = useCallback((next: Theme) => {
        setThemeState(next);
        try {
            window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // Preference just won't persist.
        }
    }, []);

    const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeContextValue {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
    return ctx;
}
