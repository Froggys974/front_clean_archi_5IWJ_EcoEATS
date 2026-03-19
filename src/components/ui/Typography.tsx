import React from "react";
function cn(...inputs: (string | undefined | false | null)[]) {
    return inputs.filter(Boolean).join(" ");
}

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "accent" | "stone" | "white";
    align?: "left" | "center" | "right";
}

const colorClasses = {
    primary: "text-primary",
    accent: "text-accent",
    stone: "text-stone-900",
    white: "text-white",
};

const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
};

export function H1({ children, className, variant = "white", align = "left", ...props }: HeadingProps) {
    return (
        <h1 
            className={cn(
                "text-6xl font-bold", 
                colorClasses[variant], 
                alignClasses[align], 
                className
            )} 
            {...props}
        >
            {children}
        </h1>
    );
}

export function H2({ children, className, variant = "stone", align = "center", ...props }: HeadingProps) {
    return (
        <h2 
            className={cn(
                "text-3xl font-bold", 
                colorClasses[variant], 
                alignClasses[align], 
                className
            )} 
            {...props}
        >
            {children}
        </h2>
    );
}

export function H3({ children, className, variant = "stone", align = "left", ...props }: HeadingProps) {
    return (
        <h3 
            className={cn(
                "text-2xl font-semibold leading-tight", 
                colorClasses[variant], 
                alignClasses[align], 
                className
            )} 
            {...props}
        >
            {children}
        </h3>
    );
}
