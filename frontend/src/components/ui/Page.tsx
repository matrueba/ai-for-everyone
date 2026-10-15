import React from "react";
import Icon from "./Icon";
import { useT } from "../../i18n";
import type { PageId } from "../../i18n/content-types";
import { PAGE_META, formatStep } from "../../navigation";
import styles from "./Page.module.css";

type PageWidth = "prose" | "content" | "wide";

interface PageProps {
    width?: PageWidth | undefined;
    children: React.ReactNode;
}

/** Centered column with the page gutter; `width` picks the reading or the workspace measure. */
export const Page: React.FC<PageProps> = ({ width = "content", children }) => (
    <div className={`${styles.page} animate-in`} data-width={width}>
        {children}
    </div>
);

interface PageHeaderProps {
    /** Shows "Group · 03" above the title, taken from the learning path. */
    page?: PageId | undefined;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    /** Right-aligned slot (tabs, scenario picker…); wraps below the title on narrow screens. */
    actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ page, title, subtitle, actions }) => {
    const t = useT("common");
    const meta = page ? PAGE_META[page] : undefined;

    return (
        <header className={styles.header}>
            <div className={styles.heading}>
                {meta?.group && meta.step !== undefined && (
                    <p className={styles.eyebrow}>
                        <Icon name={meta.icon} size={14} />
                        <span>{t.nav.groups[meta.group]}</span>
                        <span className={styles.eyebrowStep}>{formatStep(meta.step)}</span>
                    </p>
                )}
                <h1 className={styles.title}>{title}</h1>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
            {actions && <div className={styles.actions}>{actions}</div>}
        </header>
    );
};

interface SectionProps {
    children: React.ReactNode;
    gap?: "sm" | "md" | "lg" | undefined;
}

/** Vertical stack with consistent spacing between page blocks. */
export const Stack: React.FC<SectionProps> = ({ children, gap = "md" }) => (
    <div className={styles.stack} data-gap={gap}>
        {children}
    </div>
);
