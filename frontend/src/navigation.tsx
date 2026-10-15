import React, { createContext, useContext } from "react";
import type { PageId } from "./i18n/content-types";
import type { IconName } from "./components/ui/Icon";
import styles from "./navigation.module.css";

/**
 * App.tsx routes by state, not by URL, so a link inside translated prose needs
 * access to `setActivePage`. Exposing it through context lets locale files use
 * `<PageLink to="gradient-descent">…</PageLink>` directly, with no prop drilling.
 */
const NavContext = createContext<((page: PageId) => void) | null>(null);

export const NavProvider = NavContext.Provider;

/** Returns the page setter, or null outside the provider. */
export const useNavigate = () => useContext(NavContext);

export type NavGroupId = "fundamentals" | "networks";

export interface PageMeta {
    icon: IconName;
    /** Position in the learning path (Home has none). */
    step?: number;
    group?: NavGroupId;
}

/** Learning path: the order here is the order of the sidebar and the step numbers. */
export const NAV_GROUPS: { id: NavGroupId; pages: PageId[] }[] = [
    { id: "fundamentals", pages: ["history", "train", "gradient-descent", "inference", "evaluation"] },
    { id: "networks", pages: ["neural-network", "visualizer"] },
];

const ICONS: Record<PageId, IconName> = {
    home: "home",
    history: "history",
    train: "graduation",
    "gradient-descent": "trendingDown",
    inference: "target",
    evaluation: "flask",
    "neural-network": "network",
    visualizer: "eye",
};

export const PAGE_META: Record<PageId, PageMeta> = (() => {
    const meta = Object.fromEntries(
        Object.entries(ICONS).map(([id, icon]) => [id, { icon }])
    ) as Record<PageId, PageMeta>;
    let step = 1;
    for (const group of NAV_GROUPS) {
        for (const page of group.pages) {
            meta[page] = { ...meta[page], step: step++, group: group.id };
        }
    }
    return meta;
})();

/** Pages in learning-path order, used for "next step" links. */
export const PATH_ORDER: PageId[] = NAV_GROUPS.flatMap((g) => g.pages);

export const formatStep = (step: number) => String(step).padStart(2, "0");

interface PageLinkProps {
    to: PageId;
    children: React.ReactNode;
}

/** Inline link that navigates to another page; degrades to bold text if no provider is mounted. */
export const PageLink: React.FC<PageLinkProps> = ({ to, children }) => {
    const setActivePage = useNavigate();

    if (!setActivePage) {
        return <strong className={styles.fallback}>{children}</strong>;
    }

    return (
        <button type="button" onClick={() => setActivePage(to)} className={styles.link}>
            {children}
        </button>
    );
};
