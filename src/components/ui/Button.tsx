import React from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { Icons, IconName, IconProps } from "@/components/icons";

type GradientDirection =
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";

interface ButtonProps {
    children?: React.ReactNode;
    href?: string;
    onClick?: () => void;
    variant?: "primary" | "accent" | "stone" | "white" | "outline";
    color?: string;
    textColor?: string;
    gradient?: boolean;
    gradientDirection?: GradientDirection;
    icon?: React.ReactNode | IconName;
    iconSize?: IconProps["size"];
    iconPosition?: "left" | "right";
    animate?: boolean;
    className?: string;
    fullWidth?: boolean;
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
}

const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary/90",
    accent: "bg-accent text-white hover:bg-accent/90",
    stone: "bg-stone-900 text-white hover:bg-stone-800",
    white: "bg-white text-stone-900 hover:bg-stone-50",
    outline: "border border-accent text-accent hover:bg-accent/10",
};

const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-8 py-4 text-lg",
};

const gradientDirectionClasses: Record<GradientDirection, string> = {
    top: "bg-gradient-to-t",
    bottom: "bg-gradient-to-b",
    left: "bg-gradient-to-l",
    right: "bg-gradient-to-r",
    "top-left": "bg-gradient-to-tl",
    "top-right": "bg-gradient-to-tr",
    "bottom-left": "bg-gradient-to-bl",
    "bottom-right": "bg-gradient-to-br",
};

export default function Button({
    children,
    href,
    onClick,
    variant = "primary",
    color,
    textColor,
    gradient,
    gradientDirection = "right",
    icon,
    iconSize,
    iconPosition = "left",
    animate = true,
    className = "",
    fullWidth = false,
    size = "md",
    disabled = false,
}: ButtonProps) {
    const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
    
    const gradientClasses = gradient 
        ? `${gradientDirectionClasses[gradientDirection]} from-accent to-accent/80 text-white hover:shadow-lg hover:scale-[1.02]`
        : "";

    const animationClasses = animate ? "active:scale-95" : "";
    
    const combinedClasses = cn(
        baseClasses,
        !gradient && variantClasses[variant],
        sizeClasses[size],
        gradient && gradientClasses,
        animationClasses,
        fullWidth ? "w-full" : "",
        className
    );

    const style: React.CSSProperties = {};
    if (color && !gradient) style.backgroundColor = color;
    if (textColor) style.color = textColor;

    const renderIcon = () => {
        if (!icon) return null;
        if (typeof icon === "string" && icon in Icons) {
            const IconComponent = Icons[icon as IconName];
            const defaultIconSize = size === "sm" ? 18 : size === "lg" ? 28 : 24;
            return <IconComponent size={iconSize ?? defaultIconSize} />;
        }
        return icon;
    };

    const iconElement = renderIcon();

    const content = (
        <>
            {iconElement && iconPosition === "left" && <span className="mr-2">{iconElement}</span>}
            {children}
            {iconElement && iconPosition === "right" && <span className="ml-2">{iconElement}</span>}
        </>
    );

    if (href) {
        return (
            <Link href={href} className={combinedClasses} style={style}>
                {content}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={combinedClasses} style={style} disabled={disabled}>
            {content}
        </button>
    );
}
