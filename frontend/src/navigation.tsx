import React, { createContext, useContext } from "react";
import type { PageId } from "./i18n/content-types";

/**
 * App.tsx routes by state, not by URL, so a link inside translated prose needs
 * access to `setActivePage`. Exposing it through context lets locale files use
 * `<PageLink to="gradient-descent">…</PageLink>` directly, with no prop drilling.
 */
const NavContext = createContext<((page: PageId) => void) | null>(null);

export const NavProvider = NavContext.Provider;

interface PageLinkProps {
    to: PageId;
    children: React.ReactNode;
}

/** Inline link that navigates to another page; degrades to bold text if no provider is mounted. */
export const PageLink: React.FC<PageLinkProps> = ({ to, children }) => {
    const setActivePage = useContext(NavContext);

    if (!setActivePage) {
        return <strong className="text-accent-indigo font-bold">{children}</strong>;
    }

    return (
        <button
            onClick={() => setActivePage(to)}
            className="text-accent-indigo hover:text-accent-indigo/80 font-bold underline transition-colors cursor-pointer inline-flex items-center gap-0.5"
        >
            {children}
        </button>
    );
};
