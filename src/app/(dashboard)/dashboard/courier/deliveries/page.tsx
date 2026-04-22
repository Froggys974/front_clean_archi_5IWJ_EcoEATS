"use client";

import { useState } from "react";
import { useCourier } from "@/context/CourierContext";
import { TruckIcon, ClockIcon, MapPinIcon } from "@/components/icons";

export default function CourierDeliveriesPage() {
    const { isAvailable, pendingDeliveries, activeDelivery, history, acceptDelivery, refuseDelivery, pickupDelivery, completeDelivery } = useCourier();
    const [tab, setTab] = useState<"pending" | "active" | "history">("active");

    const effectiveTab = activeDelivery ? tab : pendingDeliveries.length > 0 ? "pending" : "history";

    return (
        <div className="flex flex-col gap-6 max-w-3xl">
            <h1 className="text-2xl font-bold text-stone-900">Livraisons</h1>

            {!isAvailable && (
                <div className="bg-stone-100 rounded-2xl px-5 py-4 text-stone-500 text-sm font-medium">
                    Vous êtes actuellement indisponible. Activez votre disponibilité depuis le tableau de bord pour recevoir des propositions.
                </div>
            )}
            <div className="flex gap-2 bg-stone-100 p-1 rounded-xl w-fit">
                {(["pending", "active", "history"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            tab === t ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
                        }`}
                    >
                        {t === "pending" ? `Propositions (${pendingDeliveries.length})` : t === "active" ? "En cours" : "Historique"}
                    </button>
                ))}
            </div>
            {tab === "pending" && (
                <div className="flex flex-col gap-4">
                    {pendingDeliveries.length === 0 ? (
                        <EmptyState text="Aucune proposition pour le moment. Restez disponible !" />
                    ) : (
                        pendingDeliveries.map((d) => (
                            <div key={d.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex flex-col gap-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-bold text-stone-900">{d.restaurantName}</p>
                                        <p className="text-xs text-stone-400 mt-0.5">{d.restaurantAddress}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-lg font-bold text-accent">+{(d.fee + d.tip).toFixed(2)} €</p>
                                        <p className="text-xs text-stone-400">{d.distance} km</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-stone-600">
                                    <MapPinIcon size={14} className="text-accent shrink-0" />
                                    <span className="truncate">{d.customerAddress}</span>
                                </div>

                                <div className="flex flex-wrap gap-2 text-xs text-stone-500">
                                    {d.items.map((item, i) => (
                                        <span key={i} className="bg-stone-50 px-2.5 py-1 rounded-full">
                                            {item.quantity}× {item.name}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => refuseDelivery(d.id)}
                                        className="cursor-pointer flex-1 py-2.5 rounded-xl text-sm font-semibold border border-stone-200 text-stone-500 hover:border-red-300 hover:text-red-500 transition-colors"
                                    >
                                        Refuser
                                    </button>
                                    <button
                                        onClick={() => { acceptDelivery(d.id); setTab("active"); }}
                                        disabled={!!activeDelivery}
                                        className="cursor-pointer flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                                        style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                                    >
                                        {activeDelivery ? "Déjà en livraison" : "Accepter"}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
            {tab === "active" && (
                <div>
                    {!activeDelivery ? (
                        <EmptyState text="Aucune livraison en cours. Acceptez une proposition pour commencer." />
                    ) : (
                        <div className="bg-white rounded-2xl border-2 border-accent shadow-sm p-5 flex flex-col gap-5">
                            <div className="flex items-center gap-2">
                                <TruckIcon size={20} className="text-accent" />
                                <h2 className="font-bold text-stone-900">Livraison en cours</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <InfoCell label="Restaurant" value={activeDelivery.restaurantName} />
                                <InfoCell label="Client" value={activeDelivery.customerName} />
                                <InfoCell label="Collecte" value={activeDelivery.restaurantAddress} />
                                <InfoCell label="Livraison" value={activeDelivery.customerAddress} />
                                <InfoCell label="Distance" value={`${activeDelivery.distance} km`} />
                                <InfoCell label="Gain" value={`${(activeDelivery.fee + activeDelivery.tip).toFixed(2)} €`} highlight />
                            </div>

                            <div className="flex flex-wrap gap-2 text-xs text-stone-500">
                                {activeDelivery.items.map((item, i) => (
                                    <span key={i} className="bg-stone-50 px-2.5 py-1 rounded-full">
                                        {item.quantity}× {item.name}
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2 mt-1">
                                <Step label="Acceptée" done />
                                <div className="flex-1 self-center border-t-2 border-dashed border-stone-200" />
                                <Step label="Collectée" done={activeDelivery.status === "PICKED_UP"} />
                                <div className="flex-1 self-center border-t-2 border-dashed border-stone-200" />
                                <Step label="Livrée" done={activeDelivery.status === "DELIVERED"} />
                            </div>

                            {activeDelivery.status === "ACCEPTED" && (
                                <button
                                    onClick={() => pickupDelivery(activeDelivery.id)}
                                    className="cursor-pointer py-3 rounded-xl text-sm font-bold text-white transition-all hover:shadow-md"
                                    style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                                >
                                    Confirmer la collecte au restaurant
                                </button>
                            )}
                            {activeDelivery.status === "PICKED_UP" && (
                                <button
                                    onClick={() => { completeDelivery(activeDelivery.id); setTab("history"); }}
                                    className="cursor-pointer py-3 rounded-xl text-sm font-bold text-white bg-green-500 hover:bg-green-600 transition-all"
                                >
                                    Confirmer la livraison
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
            {tab === "history" && (
                <div className="flex flex-col gap-3">
                    {history.length === 0 ? (
                        <EmptyState text="Aucune livraison dans l'historique." />
                    ) : (
                        history.map((d) => (
                            <div key={d.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm px-5 py-4 flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-stone-900">{d.customerName}</p>
                                    <p className="text-xs text-stone-400 truncate">{d.restaurantName} · {d.distance} km</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-bold text-green-600">+{(d.fee + d.tip).toFixed(2)} €</p>
                                    <p className="text-xs text-stone-400">{formatRelative(d.createdAt)}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

function Step({ label, done }: { label: string; done: boolean }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${done ? "" : "bg-stone-200"}`}
                style={done ? { background: "linear-gradient(135deg, var(--primary), var(--accent))" } : undefined}
            >
                {done ? "✓" : "○"}
            </div>
            <span className="text-[10px] text-stone-500 text-center leading-tight">{label}</span>
        </div>
    );
}

function InfoCell({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-stone-400">{label}</span>
            <span className={`font-semibold text-sm ${highlight ? "text-accent" : "text-stone-900"}`}>{value}</span>
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm flex items-center justify-center py-14 text-stone-400 text-sm text-center px-6">
            {text}
        </div>
    );
}

function formatRelative(date: Date): string {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (diff < 1) return "À l'instant";
    if (diff < 60) return `Il y a ${diff} min`;
    const h = Math.floor(diff / 60);
    return `Il y a ${h}h`;
}
