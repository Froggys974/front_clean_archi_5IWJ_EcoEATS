"use client";

import React, { useRef, ReactNode } from "react";
import { H2 } from "@/components/ui/Typography";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";

interface CarouselProps<T> {
    title?: string;
    items: T[];
    renderItem: (item: T) => ReactNode;
    keyExtractor: (item: T) => string | number;
    emptyMessage?: string;
    className?: string;
}

export default function Carousel<T>({
    title,
    items,
    renderItem,
    keyExtractor,
    emptyMessage = "Aucun élément disponible pour le moment.",
    className = "",
}: CarouselProps<T>) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;
        const scrollAmount = clientWidth;

        const isAtEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth;
        const isAtStart = scrollLeft <= 0;

        if (direction === 'right') {
            container.scrollTo({ left: isAtEnd ? 0 : scrollLeft + scrollAmount, behavior: 'smooth' });
        } else {
            container.scrollTo({ left: isAtStart ? scrollWidth : scrollLeft - scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className={`w-full max-w-7xl mx-auto px-4 py-12 ${className}`}>
            <div className="flex items-center justify-between gap-4 mb-8">
                {title && <H2 align="left">{title}</H2>}
                <div className="flex items-center gap-2 shrink-0 ml-auto">
                    <button
                        onClick={() => scroll('left')}
                        className="cursor-pointer w-10 h-10 rounded-full bg-stone-100 text-stone-600 hover:bg-accent/10 hover:text-accent transition-colors flex items-center justify-center"
                        aria-label="Précédent"
                    >
                        <ArrowLeftIcon size={18} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="cursor-pointer w-10 h-10 rounded-full bg-stone-100 text-stone-600 hover:bg-accent/10 hover:text-accent transition-colors flex items-center justify-center"
                        aria-label="Suivant"
                    >
                        <ArrowRightIcon size={18} />
                    </button>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="flex items-center justify-center py-16 rounded-2xl border border-dashed border-stone-200 bg-stone-50">
                    <p className="text-stone-400 text-sm">{emptyMessage}</p>
                </div>
            ) : (
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-5 pb-4 snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {items.map((item) => (
                        <div
                            key={keyExtractor(item)}
                            className="min-w-[16rem] sm:min-w-[calc(50%-10px)] md:min-w-[calc(33.333%-14px)] lg:min-w-[calc(25%-15px)] xl:min-w-[calc(20%-16px)] snap-start"
                        >
                            {renderItem(item)}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
