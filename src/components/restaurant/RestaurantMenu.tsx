"use client";

import { useRef, useState } from "react";
import { FoodItem, FoodCategory } from "@/types/food";
import { useCart } from "@/context/CartContext";
import MenuItemCard from "./MenuItemCard";
import CartConflictModal from "./CartConflictModal";

interface CategoryWithItems {
    category: FoodCategory;
    items: FoodItem[];
}

interface RestaurantMenuProps {
    sections: CategoryWithItems[];
    restaurantId: number;
    restaurantName: string;
}

export default function RestaurantMenu({ sections, restaurantId, restaurantName }: RestaurantMenuProps) {
    const { addItem, updateQuantity, clearCart, restaurantName: cartRestaurantName, items: cartItems } = useCart();
    const [conflictItem, setConflictItem] = useState<FoodItem | null>(null);
    const [activeCategory, setActiveCategory] = useState(sections[0]?.category.id ?? 0);
    const sectionRefs = useRef<Record<number, HTMLElement | null>>({});

    const scrollToCategory = (id: number) => {
        setActiveCategory(id);
        sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const cartQty = (foodId: number) =>
        cartItems.find((i) => i.foodId === foodId)?.quantity ?? 0;

    const handleAdd = (item: FoodItem) => {
        const result = addItem(
            { foodId: item.id, name: item.name, price: item.price, image: item.image },
            restaurantId,
            restaurantName,
        );
        if (result === "conflict") setConflictItem(item);
    };

    const handleConflictConfirm = () => {
        if (!conflictItem) return;
        clearCart();
        addItem(
            { foodId: conflictItem.id, name: conflictItem.name, price: conflictItem.price, image: conflictItem.image },
            restaurantId,
            restaurantName,
        );
        setConflictItem(null);
    };

    return (
        <>
            {/* Category tab bar */}
            <div className="sticky top-18 z-10 bg-white border-b border-stone-100 shadow-sm">
                <div className="flex gap-1 overflow-x-auto px-1 py-2" style={{ scrollbarWidth: "none" }}>
                    {sections.map(({ category }) => (
                        <button
                            key={category.id}
                            onClick={() => scrollToCategory(category.id)}
                            className={`cursor-pointer shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                activeCategory === category.id
                                    ? "bg-accent text-white shadow-sm"
                                    : "text-stone-600 hover:bg-stone-100"
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu sections */}
            <div className="flex flex-col gap-10 py-6">
                {sections.map(({ category, items }) => (
                    <section
                        key={category.id}
                        ref={(el) => { sectionRefs.current[category.id] = el; }}
                        id={`category-${category.id}`}
                    >
                        <h2 className="text-xl font-bold text-stone-900 mb-1">{category.name}</h2>
                        {category.description && (
                            <p className="text-stone-400 text-sm mb-4">{category.description}</p>
                        )}
                        <div className="flex flex-col gap-3">
                            {items.map((item) => (
                                <MenuItemCard
                                    key={item.id}
                                    item={item}
                                    onAdd={handleAdd}
                                    quantityInCart={cartQty(item.id)}
                                    onIncrement={handleAdd}
                                    onDecrement={(id) => updateQuantity(id, -1)}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {conflictItem && (
                <CartConflictModal
                    currentRestaurantName={cartRestaurantName}
                    onConfirm={handleConflictConfirm}
                    onCancel={() => setConflictItem(null)}
                />
            )}
        </>
    );
}
