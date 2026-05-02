"use client";

import React, { useState } from "react";
import Link from "next/link";
import { H2 } from "@/components/ui/Typography";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import type { FoodCategory } from "@/types/food";
import Picture from "@/components/other/Picture";

const ITEMS_PER_PAGE = 6;

interface SearchPerFoodProps {
    title?: string;
    categories?: FoodCategory[];
}

export default function SearchPerFood({ title, categories = [] }: SearchPerFoodProps) {
    const [page, setPage] = useState(0);

    if (categories.length === 0) return null;

    const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
    const visible = categories.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

    const prev = () => setPage((p) => Math.max(0, p - 1));
    const next = () => setPage((p) => Math.min(totalPages - 1, p + 1));

    return (
        <section className="w-full py-14 bg-primary/10">
            <div className="w-full max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 mb-10">
                    {title ? <H2 align="left">{title}</H2> : <span />}
                    <div className="flex items-center gap-3 shrink-0">
                        {totalPages > 1 && (
                            <span className="text-sm text-stone-400 font-medium tabular-nums">
                                {page + 1} / {totalPages}
                            </span>
                        )}
                        <button
                            onClick={prev}
                            disabled={page === 0}
                            className="cursor-pointer w-10 h-10 rounded-full bg-white border border-stone-200 text-stone-500 hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-sm"
                            aria-label="Page précédente"
                        >
                            <ArrowLeftIcon size={18} />
                        </button>
                        <button
                            onClick={next}
                            disabled={page === totalPages - 1}
                            className="cursor-pointer w-10 h-10 rounded-full bg-white border border-stone-200 text-stone-500 hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-sm"
                            aria-label="Page suivante"
                        >
                            <ArrowRightIcon size={18} />
                        </button>
                    </div>
                </div>

                {/* Grid — 3 cols on mobile (2 rows), 6 on desktop (1 row) */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
                    {visible.map((category) => (
                        <Link
                            key={category.id}
                            href={`/restaurants?category=${category.slug ?? category.id}`}
                            className="group flex flex-col items-center gap-3 cursor-pointer"
                        >
                            <div className="w-full aspect-square rounded-full overflow-hidden bg-white border-2 border-transparent group-hover:border-accent transition-all duration-200 shadow-sm group-hover:shadow-md max-w-28 mx-auto">
                                <Picture
                                    className="w-full h-full"
                                    imgClassName="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    alt={category.name}
                                    desktop={category.visual ?? ''}
                                    tablet={category.visual ?? ''}
                                    mobile={category.visual ?? ''}
                                />
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-stone-700 group-hover:text-accent transition-colors text-center leading-tight">
                                {category.name}
                            </span>
                        </Link>
                    ))}
                </div>

                {/* Page dots */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i)}
                                className={`cursor-pointer rounded-full transition-all duration-200 ${
                                    i === page
                                        ? "w-6 h-2 bg-accent"
                                        : "w-2 h-2 bg-stone-300 hover:bg-stone-400"
                                }`}
                                aria-label={`Page ${i + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
