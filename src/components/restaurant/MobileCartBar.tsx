"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import RestaurantCart from "./RestaurantCart";

export default function MobileCartBar() {
    const { totalItems, subtotal } = useCart();
    const [open, setOpen] = useState(false);

    if (totalItems === 0) return null;

    return (
        <>
            {/* Floating bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-white border-t border-stone-100 shadow-2xl">
                <button
                    onClick={() => setOpen(true)}
                    className="cursor-pointer w-full py-3.5 rounded-xl font-bold text-white text-base flex items-center justify-between px-5"
                    style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                >
                    <span className="bg-white/30 text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center">
                        {totalItems}
                    </span>
                    <span>Voir le panier</span>
                    <span>{subtotal.toFixed(2)}€</span>
                </button>
            </div>

            {/* Drawer */}
            {open && (
                <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
                    <div className="relative bg-stone-50 rounded-t-2xl max-h-[80vh] overflow-y-auto pb-6">
                        <div className="flex justify-between items-center p-4 border-b border-stone-100">
                            <span className="font-bold text-stone-900">Mon panier</span>
                            <button
                                onClick={() => setOpen(false)}
                                className="cursor-pointer text-stone-400 hover:text-stone-600 text-2xl leading-none"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-4">
                            <RestaurantCart />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
