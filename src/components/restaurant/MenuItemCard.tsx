"use client";

import { FoodItem } from "@/types/food";

interface MenuItemCardProps {
    item: FoodItem;
    onAdd: (item: FoodItem) => void;
    quantityInCart: number;
    onIncrement: (item: FoodItem) => void;
    onDecrement: (foodId: number) => void;
}

export default function MenuItemCard({
    item,
    onAdd,
    quantityInCart,
    onIncrement,
    onDecrement,
}: MenuItemCardProps) {
    const outOfStock = (item.dailyStock ?? 1) === 0;
    const lowStock = !outOfStock && (item.dailyStock ?? 99) <= 3;

    return (
        <div
            className={`flex gap-4 p-4 rounded-xl border transition-all duration-200 ${
                outOfStock
                    ? "border-stone-100 bg-stone-50 opacity-60"
                    : "border-stone-100 bg-white hover:border-accent/30 hover:shadow-sm"
            }`}
        >
            {/* Image */}
            <div className="relative shrink-0 w-28 h-24 rounded-lg overflow-hidden bg-stone-100">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />
                {outOfStock && (
                    <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Épuisé</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 gap-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-stone-900 text-base leading-tight line-clamp-1">
                        {item.name}
                    </h3>
                    <span className="shrink-0 font-bold text-accent text-base">
                        {item.price.toFixed(2)}€
                    </span>
                </div>

                <p className="text-stone-500 text-sm leading-snug line-clamp-2">{item.description}</p>

                {item.allergens && item.allergens.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {item.allergens.map((a) => (
                            <span
                                key={a}
                                className="text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full"
                            >
                                {a}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-2">
                    {lowStock && (
                        <span className="text-xs text-orange-500 font-medium">
                            Plus que {item.dailyStock} restant{item.dailyStock! > 1 ? "s" : ""}
                        </span>
                    )}
                    {!lowStock && <span />}

                    {/* Cart controls */}
                    {quantityInCart === 0 ? (
                        <button
                            onClick={() => onAdd(item)}
                            disabled={outOfStock}
                            className="cursor-pointer flex items-center gap-1 bg-accent text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            + Ajouter
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onDecrement(item.id)}
                                className="cursor-pointer w-7 h-7 rounded-full bg-accent/10 text-accent font-bold hover:bg-accent/20 transition-colors flex items-center justify-center"
                            >
                                −
                            </button>
                            <span className="w-5 text-center font-semibold text-stone-900 text-sm">
                                {quantityInCart}
                            </span>
                            <button
                                onClick={() => onIncrement(item)}
                                className="cursor-pointer w-7 h-7 rounded-full bg-accent text-white font-bold hover:bg-accent/90 transition-colors flex items-center justify-center"
                            >
                                +
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
