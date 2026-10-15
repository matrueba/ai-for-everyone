import React from "react";
import Icon from "./Icon";
import type { IconName } from "./Icon";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger" | undefined;
    size?: "sm" | "md" | "lg" | undefined;
    icon?: IconName | undefined;
    iconRight?: IconName | undefined;
    /** Square button that only shows its icon; pass `aria-label`. */
    iconOnly?: boolean | undefined;
}

const ICON_SIZE = { sm: 14, md: 16, lg: 18 } as const;

const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    size = "md",
    icon,
    iconRight,
    iconOnly = false,
    className,
    type = "button",
    children,
    ...rest
}) => (
    <button
        type={type}
        className={[styles.button, className].filter(Boolean).join(" ")}
        data-variant={variant}
        data-size={size}
        data-icon-only={iconOnly || undefined}
        {...rest}
    >
        {icon && <Icon name={icon} size={ICON_SIZE[size]} />}
        {!iconOnly && children}
        {iconRight && <Icon name={iconRight} size={ICON_SIZE[size]} />}
    </button>
);

export default Button;
