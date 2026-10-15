/**
 * Small presentational pieces shared by every page: numbered badges, callouts,
 * formula blocks, sliders, stats, figures and status messages.
 */
import React from "react";
import Icon from "./Icon";
import type { IconName } from "./Icon";
import styles from "./Bits.module.css";

export type Tone = "indigo" | "purple" | "cyan" | "orange" | "green" | "red" | "neutral";

/* ── StepBadge ── */

interface StepBadgeProps {
    children: React.ReactNode;
    tone?: Tone | undefined;
    size?: "sm" | "md" | "lg" | undefined;
    /** `solid` for sequence steps, `soft` for section numbers. */
    variant?: "solid" | "soft" | undefined;
}

export const StepBadge: React.FC<StepBadgeProps> = ({ children, tone = "indigo", size = "md", variant = "soft" }) => (
    <span className={styles.badge} data-tone={tone} data-size={size} data-variant={variant}>
        {children}
    </span>
);

/** Section heading with its number badge, used for long-form numbered sections. */
export const SectionTitle: React.FC<{ step: React.ReactNode; children: React.ReactNode; level?: 2 | 3 }> = ({
    step,
    children,
    level = 2,
}) => {
    const Tag = level === 2 ? "h2" : "h3";
    return (
        <Tag className={styles.sectionTitle} data-level={level}>
            <StepBadge size={level === 2 ? "lg" : "md"}>{step}</StepBadge>
            <span>{children}</span>
        </Tag>
    );
};

/* ── Callout ── */

interface CalloutProps {
    tone?: Tone | undefined;
    icon?: IconName | undefined;
    title?: React.ReactNode;
    children: React.ReactNode;
    /** Quotes render in italics with an accent rule instead of a filled box. */
    variant?: "box" | "quote" | undefined;
}

export const Callout: React.FC<CalloutProps> = ({ tone = "indigo", icon, title, children, variant = "box" }) => (
    <div className={styles.callout} data-tone={tone} data-variant={variant}>
        {icon && (
            <span className={styles.calloutIcon}>
                <Icon name={icon} size={18} />
            </span>
        )}
        <div className={styles.calloutBody}>
            {title && <p className={styles.calloutTitle}>{title}</p>}
            <div className={styles.calloutText}>{children}</div>
        </div>
    </div>
);

/* ── Formula ── */

export const Formula: React.FC<{ children: React.ReactNode; size?: "sm" | "md" | "lg" | undefined }> = ({
    children,
    size = "lg",
}) => (
    <div className={styles.formula} data-size={size}>
        <code>{children}</code>
    </div>
);

/* ── Slider ── */

interface SliderProps {
    label: React.ReactNode;
    valueLabel: React.ReactNode;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
    tone?: Tone | undefined;
    id?: string | undefined;
}

export const Slider: React.FC<SliderProps> = ({ label, valueLabel, value, min, max, step, onChange, tone = "indigo", id }) => {
    const fill = max > min ? ((value - min) / (max - min)) * 100 : 0;
    const autoId = React.useId();
    const inputId = id ?? autoId;
    return (
        <div className={styles.slider} data-tone={tone}>
            <label className={styles.sliderLabel} htmlFor={inputId}>
                <span>{label}</span>
                <span className={styles.sliderValue}>{valueLabel}</span>
            </label>
            <input
                id={inputId}
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                style={{ "--fill": `${fill}%`, "--thumb": "var(--tone)" } as React.CSSProperties}
            />
        </div>
    );
};

/* ── Stat ── */

interface StatProps {
    label: React.ReactNode;
    value: React.ReactNode;
    tone?: Tone | undefined;
    size?: "sm" | "md" | "lg" | undefined;
}

export const Stat: React.FC<StatProps> = ({ label, value, tone = "neutral", size = "sm" }) => (
    <div className={styles.stat} data-tone={tone} data-size={size}>
        <span className={styles.statLabel}>{label}</span>
        <span className={styles.statValue}>{value}</span>
    </div>
);

/* ── Figure ── */

interface FigureProps {
    src: string;
    alt: string;
    caption?: React.ReactNode;
}

export const Figure: React.FC<FigureProps> = ({ src, alt, caption }) => (
    <figure className={styles.figure}>
        <img src={src} alt={alt} loading="lazy" decoding="async" />
        {caption && <figcaption>{caption}</figcaption>}
    </figure>
);

/* ── Status messages ── */

interface StatusProps {
    kind: "loading" | "empty" | "error";
    title?: React.ReactNode;
    children?: React.ReactNode;
    icon?: IconName | undefined;
    action?: React.ReactNode;
    /** Fill the parent's height (inside plot panels). */
    fill?: boolean | undefined;
}

export const Status: React.FC<StatusProps> = ({ kind, title, children, icon, action, fill = false }) => (
    <div
        className={styles.status}
        data-kind={kind}
        data-fill={fill || undefined}
        role={kind === "error" ? "alert" : "status"}
    >
        {kind === "loading" ? (
            <span className={styles.spinner} aria-hidden />
        ) : (
            <span className={styles.statusIcon}>
                <Icon name={icon ?? (kind === "error" ? "alert" : "info")} size={22} />
            </span>
        )}
        {title && <p className={styles.statusTitle}>{title}</p>}
        {children && <div className={styles.statusBody}>{children}</div>}
        {action}
    </div>
);

/* ── Kbd ── */

export const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => <kbd className={styles.kbd}>{children}</kbd>;
