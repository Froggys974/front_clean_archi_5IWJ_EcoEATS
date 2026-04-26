import React from "react";
import { H2 } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

type ColsOption = "1-2-3" | "1-2-4" | "1-2-2" | "1-1-2";

const colsClassMap: Record<ColsOption, string> = {
    "1-2-3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    "1-2-4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    "1-2-2": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2",
    "1-1-2": "grid-cols-1 sm:grid-cols-1 lg:grid-cols-2",
};

interface SectionGridProps<T> {
    title?: string;
    items: T[];
    renderItem: (item: T) => React.ReactNode;
    keyExtractor: (item: T) => string | number;
    cols?: ColsOption;
    emptyMessage?: string;
    showViewMore?: boolean;
    viewMoreHref?: string;
    className?: string;
}

export default function SectionGrid<T>({
    title,
    items,
    renderItem,
    keyExtractor,
    cols = "1-2-4",
    emptyMessage = "Aucun élément disponible pour le moment.",
    showViewMore = true,
    viewMoreHref = "/restaurants",
    className = "",
}: SectionGridProps<T>) {
    const gridColsClass = colsClassMap[cols];

    return (
        <section className={`w-full max-w-7xl mx-auto px-4 py-8 ${className}`}>
            {title && (
                <H2 align="left" className="mb-8">
                    {title}
                </H2>
            )}

            {items.length === 0 ? (
                <div className="flex items-center justify-center py-16 rounded-2xl border border-dashed border-stone-200 bg-stone-50">
                    <p className="text-stone-400 text-sm">{emptyMessage}</p>
                </div>
            ) : (
                <>
                    <div className={`grid ${gridColsClass} gap-6`}>
                        {items.map((item) => (
                            <div key={keyExtractor(item)}>{renderItem(item)}</div>
                        ))}
                    </div>
                    {showViewMore && (
                        <div className="flex justify-center mt-8">
                            <Button gradient gradientDirection="right" href={viewMoreHref} className="rounded-xl">
                                Voir tous les restaurants
                            </Button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
