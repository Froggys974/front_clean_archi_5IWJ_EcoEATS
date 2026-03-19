import React from "react";
import { H2 } from "@/components/ui/Typography";

interface SectionGridProps<T> {
    title?: string;
    items: T[];
    renderItem: (item: T) => React.ReactNode;
    keyExtractor: (item: T) => string | number;
    columns?: {
        default?: number;
        sm?: number;
        md?: number;
        lg?: number;
    };
    className?: string;
}

export default function SectionGrid<T>({ 
    title, 
    items, 
    renderItem, 
    keyExtractor, 
    columns = { default: 1, sm: 2, lg: 4 },
    className = ""
}: SectionGridProps<T>) {
    const gridCols = `grid-cols-${columns.default} sm:grid-cols-${columns.sm} lg:grid-cols-${columns.lg}`;

    return (
        <section className={`w-full max-w-7xl mx-auto px-4 py-8 ${className}`}>
            {title && <H2 className="mb-8">{title}</H2>}
            <div className={`grid ${gridCols} gap-6`}>
                {items.map((item) => (
                    <div key={keyExtractor(item)}>
                        {renderItem(item)}
                    </div>
                ))}
            </div>
        </section>
    );
}
