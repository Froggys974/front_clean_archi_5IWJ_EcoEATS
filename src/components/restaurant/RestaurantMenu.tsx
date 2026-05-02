"use client";

import { useRef, useState } from "react";
import { FoodItem, FoodCategory } from "@/types/food";
import { useCart } from "@/context/CartContext";
import MenuItemCard from "./MenuItemCard";
import CartConflictModal from "./CartConflictModal";
import { BagIcon } from "@/components/icons";

interface CategoryWithItems {
    category: FoodCategory;
    items: FoodItem[];
}

interface RestaurantMenuProps {
    sections: CategoryWithItems[];
    restaurantId: string;
    restaurantName: string;
}

export default function RestaurantMenu({ sections, restaurantId, restaurantName }: RestaurantMenuProps) {
    const { addItem, replaceCart, updateQuantity, restaurantName: cartRestaurantName, items: cartItems } = useCart();
    const [conflictItem, setConflictItem] = useState<FoodItem | null>(null);
    const [activeCategory, setActiveCategory] = useState(sections[0]?.category.id ?? '');
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    const scrollToCategory = (id: string) => {
        setActiveCategory(id);
        sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const cartQty = (foodId: string) =>
        cartItems.find((i) => i.foodId === foodId)?.quantity ?? 0;

    const handleAdd = async (item: FoodItem) => {
        const result = await addItem(
            { foodId: item.id, name: item.name, price: item.price, image: item.image },
            restaurantId,
            restaurantName,
        );
        if (result === "conflict") setConflictItem(item);
    };

    const handleConflictConfirm = async () => {
        if (!conflictItem) return;
        await replaceCart(
            { foodId: conflictItem.id, name: conflictItem.name, price: conflictItem.price, image: conflictItem.image },
            restaurantId,
            restaurantName,
        );
        setConflictItem(null);
    };

    if (sections.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <BagIcon size={48} className="text-stone-200" />
                <p className="text-stone-500 font-medium">Aucun plat disponible pour le moment.</p>
                <p className="text-stone-400 text-sm">Le menu de ce restaurant n&apos;a pas encore été renseigné.</p>
            </div>
        );
    }

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
                                    onDecrement={(id) => { void updateQuantity(id, -1); }}
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
