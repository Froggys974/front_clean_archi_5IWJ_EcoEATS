"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { CartIcon } from "@/components/icons";

const DELIVERY_FEE = 2.5;
const SERVICE_FEE = 0.5;

export default function RestaurantCart({ onCheckout }: { onCheckout?: () => void } = {}) {
    const { items, restaurantName, updateQuantity, removeItem, subtotal, totalItems } = useCart();
    const router = useRouter();

    const handleCheckout = () => {
        onCheckout?.();
        router.push("/checkout");
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 h-64 text-center p-6 bg-stone-50 rounded-2xl border border-dashed border-stone-200">

                <CartIcon size={48} />
                <p className="text-stone-500 text-sm leading-relaxed">
                    Votre panier est vide.<br />Ajoutez des plats pour commencer.
                </p>
            </div>
        );
    }

    const total = subtotal + DELIVERY_FEE + SERVICE_FEE;

    return (
        <div className="flex flex-col gap-4 bg-white rounded-2xl border border-stone-100 shadow-md overflow-hidden">
            {/* Header */}
            <div className="px-5 pt-5 pb-3 border-b border-stone-100">
                <h2 className="font-bold text-stone-900 text-base">Mon panier</h2>
                <p className="text-stone-400 text-xs mt-0.5">{restaurantName}</p>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-2 px-4 max-h-80 overflow-y-auto">
                {items.map((item) => (
                    <div key={item.foodId} className="flex items-center gap-3 py-2">
                        <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-stone-900 line-clamp-1">{item.name}</p>
                            <p className="text-xs text-accent font-semibold">{(item.price * item.quantity).toFixed(2)}€</p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                            <button
                                onClick={() => updateQuantity(item.foodId, -1)}
                                className="cursor-pointer w-6 h-6 rounded-full bg-stone-100 text-stone-600 text-sm font-bold hover:bg-stone-200 transition-colors flex items-center justify-center"
                            >
                                −
                            </button>
                            <span className="w-4 text-center text-sm font-semibold">{item.quantity}</span>
                            <button
                                onClick={() => updateQuantity(item.foodId, 1)}
                                className="cursor-pointer w-6 h-6 rounded-full bg-accent text-white text-sm font-bold hover:bg-accent/90 transition-colors flex items-center justify-center"
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={() => removeItem(item.foodId)}
                            className="cursor-pointer text-stone-300 hover:text-red-400 transition-colors text-lg leading-none ml-1"
                            aria-label="Supprimer"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="px-5 py-4 bg-stone-50 border-t border-stone-100 flex flex-col gap-2">
                <div className="flex justify-between text-sm text-stone-500">
                    <span>Sous-total ({totalItems} article{totalItems > 1 ? "s" : ""})</span>
                    <span>{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-sm text-stone-500">
                    <span>Frais de livraison</span>
                    <span>{DELIVERY_FEE.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-sm text-stone-500">
                    <span>Frais de service</span>
                    <span>{SERVICE_FEE.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 text-base pt-2 border-t border-stone-200 mt-1">
                    <span>Total</span>
                    <span>{total.toFixed(2)}€</span>
                </div>
            </div>

            {/* CTA */}
            <div className="px-5 pb-5">
                <button
                    onClick={handleCheckout}
                    className="cursor-pointer w-full py-3.5 rounded-xl font-bold text-white text-base transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95"
                    style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                >
                    Commander · {total.toFixed(2)} €
                </button>
            </div>
        </div>
    );
}
