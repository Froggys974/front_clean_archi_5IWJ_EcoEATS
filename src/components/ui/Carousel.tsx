"use client";

import React, { useRef, ReactNode } from "react";
import { H2 } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

interface CarouselProps<T> {
    title?: string;
    items: T[];
    renderItem: (item: T) => ReactNode;
    keyExtractor: (item: T) => string | number;
    className?: string;
}

export default function Carousel<T>({ title, items, renderItem, keyExtractor, className = "" }: CarouselProps<T>) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;
        const scrollAmount = clientWidth;
        
        const isAtEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth;
        const isAtStart = scrollLeft <= 0;

        if (direction === 'right') {
            if (isAtEnd) {
                container.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        } else {
            if (isAtStart) {
                container.scrollTo({ left: scrollWidth, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <section className={`w-full max-w-7xl mx-auto px-4 py-12 ${className}`}>
            {title && <H2 className="mb-8">{title}</H2>}
            
            <div className="relative">
                <Button 
                    onClick={() => scroll('left')}
                    variant="accent"
                    size="sm"
                    className="absolute left-0 top-1/2 h-10 w-10 -translate-y-1/2 -translate-x-20 z-10 p-3 rounded-full bg-accent/10 text-accent hover:bg-accent/20 shadow-sm hidden md:flex"
                    aria-label="Précédent"
                    icon="ArrowLeft"
                />

                <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {items.map((item) => (
                        <div key={keyExtractor(item)} className="min-w-70 sm:min-w-[calc(50%-12px)] md:min-w-[calc(33.333%-16px)] lg:min-w-[calc(25%-18px)] xl:min-w-[calc(20%-19.2px)] snap-start">
                            {renderItem(item)}
                        </div>
                    ))}
                </div>

                <Button 
                    onClick={() => scroll('right')}
                    variant="accent"
                    size="md"
                    className="absolute right-0 top-1/2 h-10 w-10 -translate-y-1/2 translate-x-20 z-10 p-3 rounded-full bg-accent/10 text-accent hover:bg-accent/20 shadow-sm hidden md:flex"
                    aria-label="Suivant"
                    icon="ArrowRight"
                />
            </div>
        </section>
    );
}
