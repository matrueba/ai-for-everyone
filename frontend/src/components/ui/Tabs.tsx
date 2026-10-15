import React from "react";
import Icon from "./Icon";
import type { IconName } from "./Icon";
import styles from "./Tabs.module.css";

export interface TabItem<T extends string> {
    id: T;
    label: React.ReactNode;
    icon?: IconName | undefined;
    /** Show only the icon; the label stays available to assistive tech and as a tooltip. */
    iconOnly?: boolean | undefined;
}

interface TabsProps<T extends string> {
    items: TabItem<T>[];
    value: T;
    onChange: (id: T) => void;
    /** Accessible name of the group. */
    label: string;
    size?: "sm" | "md" | undefined;
    /** Stretch tabs to fill the container width. */
    block?: boolean | undefined;
}

/** Segmented control: the single tab style used across the app. */
function Tabs<T extends string>({ items, value, onChange, label, size = "md", block = false }: TabsProps<T>) {
    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const index = items.findIndex((item) => item.id === value);
        const delta = e.key === "ArrowRight" ? 1 : -1;
        const next = items[(index + delta + items.length) % items.length];
        if (!next) return;
        e.preventDefault();
        onChange(next.id);
        const buttons = e.currentTarget.querySelectorAll<HTMLButtonElement>("button");
        buttons[items.indexOf(next)]?.focus();
    };

    return (
        <div
            className={styles.tabs}
            role="tablist"
            aria-label={label}
            data-size={size}
            data-block={block || undefined}
            onKeyDown={onKeyDown}
        >
            {items.map((item) => {
                const selected = item.id === value;
                return (
                    <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        tabIndex={selected ? 0 : -1}
                        className={styles.tab}
                        onClick={() => onChange(item.id)}
                        title={item.iconOnly && typeof item.label === "string" ? item.label : undefined}
                    >
                        {item.icon && <Icon name={item.icon} size={size === "sm" ? 14 : 15} />}
                        {item.iconOnly ? <span className="visually-hidden">{item.label}</span> : item.label}
                    </button>
                );
            })}
        </div>
    );
}

export default Tabs;
