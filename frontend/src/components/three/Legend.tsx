import React from "react";
import styles from "./Legend.module.css";

interface RampLegendProps {
    ramp: (t: number) => string;
    low: string;
    high: string;
}

/** Colour bar explaining what the surface colour means. */
export const RampLegend: React.FC<RampLegendProps> = ({ ramp, low, high }) => {
    const stops = Array.from({ length: 6 }, (_, k) => `${ramp(k / 5)} ${k * 20}%`).join(", ");
    return (
        <div className={styles.ramp}>
            <span className={styles.bar} style={{ background: `linear-gradient(90deg, ${stops})` }} />
            <span className={styles.rampLabels}>
                <span>{low}</span>
                <span>{high}</span>
            </span>
        </div>
    );
};

interface KeyItem {
    label: string;
    color: string;
    shape?: "dot" | "line" | "ring" | "arrow" | undefined;
}

/** Swatch + label rows for the marks in a scene. */
export const KeyLegend: React.FC<{ items: KeyItem[] }> = ({ items }) => (
    <ul className={styles.keys}>
        {items.map((item) => (
            <li key={item.label}>
                <span className={styles.swatch} data-shape={item.shape ?? "dot"} style={{ color: item.color }} />
                {item.label}
            </li>
        ))}
    </ul>
);
