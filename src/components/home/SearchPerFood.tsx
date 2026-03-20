"use client";

import React, { useRef } from "react";
import { H2 } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import foodCategories from "../../data/foodCategory.json";
import Picture from "@/components/other/Picture";

interface SearchPerFoodProps {
    title?: string;
    maxItems?: number;
    itemSize?: "sm" | "md" | "lg";
    showCategoryName?: boolean;
}

export default function SearchPerFood({
    title,
    itemSize = "md",
    showCategoryName = false
}: SearchPerFoodProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const sizeClasses = {
        sm: "w-40 h-40",
        md: "w-50 h-50",
        lg: "w-60 h-60"
    };

    const displayedCategories = foodCategories;

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
        <section className="w-full bg-primary/10 py-12">
            <div className="w-full max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center gap-8 mb-8">
                    {title && <H2>{title}</H2>}
                    <div className="flex gap-2">
                        <Button variant="outline" icon="ArrowRight" iconPosition="right">
                            voir plus
                        </Button>
                        <Button
                            onClick={() => scroll('left')}
                            variant="accent"
                            size="md"
                            className="h-15 w-15 rounded-full"
                            aria-label="Précédent"
                            icon="ArrowLeft"
                            iconSize={35}
                        />
                        <Button
                            onClick={() => scroll('right')}
                            variant="accent"
                            size="md"
                            className="h-15 w-15 rounded-full"
                            aria-label="Suivant"
                            icon="ArrowRight"
                            iconSize={35}
                        />
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {displayedCategories.map((foodCategory) => (
                        <div key={foodCategory.id} className="min-w-max">
                            <div className="flex flex-col items-center gap-2">
                                <div
                                    className={`${sizeClasses[itemSize]} rounded-full overflow-hidden shrink-0 bg-primary/5`}
                                >
                                    <Picture
                                        className="w-full h-full"
                                        imgClassName="w-full h-full object-cover"
                                        alt={foodCategory.name}
                                        desktop={foodCategory.visual}
                                        tablet={foodCategory.visual}
                                        mobile={foodCategory.visual}
                                    />
                                </div>
                                {showCategoryName && (
                                    <p className="text-sm font-medium text-center line-clamp-1">
                                        {foodCategory.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}