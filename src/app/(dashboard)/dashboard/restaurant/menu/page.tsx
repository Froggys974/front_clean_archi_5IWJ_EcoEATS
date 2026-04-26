"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRestaurant } from "@/context/RestaurantContext";
import Modal from "@/components/ui/Modal";
import { BagIcon } from "@/components/icons";

export default function MenuPage() {
    const { dishes, deleteDish } = useRestaurant();
    const [confirmId, setConfirmId] = useState<number | null>(null);

    const handleDelete = () => {
        if (confirmId !== null) {
            deleteDish(confirmId);
            setConfirmId(null);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900">Menu & plats</h1>
                    <p className="text-stone-400 text-sm mt-0.5">{dishes.length} plat{dishes.length !== 1 ? "s" : ""} au catalogue</p>
                </div>
                <Link
                    href="/dashboard/restaurant/menu/new"
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:shadow-md hover:scale-[1.01] active:scale-95"
                    style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                >
                    + Ajouter un plat
                </Link>
            </div>

            {dishes.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-stone-200 p-12 flex flex-col items-center gap-3 text-center">
                    <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-stone-300">
                        <BagIcon size={28} />
                    </div>
                    <p className="font-semibold text-stone-700">Aucun plat dans votre menu</p>
                    <Link href="/dashboard/restaurant/menu/new" className="text-accent text-sm font-semibold hover:underline">
                        Ajouter votre premier plat →
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {dishes.map((dish) => (
                        <div key={dish.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden flex">
                            <div className="relative w-24 h-24 shrink-0 bg-stone-100 overflow-hidden">
                                <Image src={dish.image} alt={dish.name} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col flex-1 p-3 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="text-sm font-bold text-stone-900 line-clamp-1">{dish.name}</p>
                                    <span className="text-sm font-bold text-accent shrink-0">{dish.price.toFixed(2)} €</span>
                                </div>
                                <p className="text-xs text-stone-400 line-clamp-2 mt-0.5 flex-1">{dish.description}</p>
                                <div className="flex items-center justify-between mt-2 gap-2">
                                    <StockBadge stock={dish.dailyStock ?? 0} />
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/dashboard/restaurant/menu/${dish.id}/edit`}
                                            className="text-xs font-semibold text-stone-500 hover:text-accent transition-colors px-2 py-1 rounded-lg hover:bg-stone-50"
                                        >
                                            Modifier
                                        </Link>
                                        <button
                                            onClick={() => setConfirmId(dish.id)}
                                            className="cursor-pointer text-xs font-semibold text-stone-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Modal open={confirmId !== null} onClose={() => setConfirmId(null)} title="Supprimer le plat">
                <p className="text-sm text-stone-600 mb-6">
                    Êtes-vous sûr de vouloir supprimer{" "}
                    <strong>{dishes.find((d) => d.id === confirmId)?.name}</strong> ?
                    Cette action est irréversible.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={() => setConfirmId(null)}
                        className="cursor-pointer flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm font-semibold hover:border-stone-300 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleDelete}
                        className="cursor-pointer flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors"
                    >
                        Supprimer
                    </button>
                </div>
            </Modal>
        </div>
    );
}

function StockBadge({ stock }: { stock: number }) {
    if (stock === 0) return <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Épuisé</span>;
    if (stock <= 3) return <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Stock faible ({stock})</span>;
    return <span className="text-xs font-semibold text-stone-400 bg-stone-50 px-2 py-0.5 rounded-full">Stock : {stock}</span>;
}
