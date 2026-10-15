import React from "react";
import Icon from "./Icon";
import type { IconName } from "./Icon";
import styles from "./Card.module.css";

type Tone = "indigo" | "purple" | "cyan" | "orange" | "green" | "red" | "neutral";

interface CardProps extends React.HTMLAttributes<HTMLElement> {
    as?: "div" | "section" | "article" | "aside" | undefined;
    /** `sunken` for blocks nested inside a card; `outline` for flat, borderless-shadow panels. */
    variant?: "default" | "sunken" | "outline" | undefined;
    padding?: "none" | "sm" | "md" | "lg" | undefined;
    /** Stretch to the parent's height and lay children out as a column (for plot panels). */
    fill?: boolean | undefined;
}

export const Card: React.FC<CardProps> = ({
    as: Tag = "div",
    variant = "default",
    padding = "md",
    fill = false,
    className,
    children,
    ...rest
}) => (
    <Tag
        className={[styles.card, className].filter(Boolean).join(" ")}
        data-variant={variant}
        data-padding={padding}
        data-fill={fill || undefined}
        {...rest}
    >
        {children}
    </Tag>
);

interface CardHeaderProps {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    icon?: IconName | undefined;
    tone?: Tone | undefined;
    actions?: React.ReactNode;
    /** Small uppercase label style, for panel headers in dense tool layouts. */
    compact?: boolean | undefined;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, icon, tone = "indigo", actions, compact = false }) => (
    <div className={styles.header} data-compact={compact || undefined}>
        <div className={styles.headerMain}>
            {icon && (
                <span className={styles.headerIcon} data-tone={tone}>
                    <Icon name={icon} size={compact ? 15 : 18} />
                </span>
            )}
            <div className={styles.headerText}>
                <h3 className={styles.title}>{title}</h3>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
        </div>
        {actions && <div className={styles.headerActions}>{actions}</div>}
    </div>
);
