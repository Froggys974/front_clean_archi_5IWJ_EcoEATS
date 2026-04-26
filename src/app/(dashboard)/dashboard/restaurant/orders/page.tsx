"use client";

import { useState } from "react";
import { useRestaurant, DashboardOrder, DashboardOrderStatus } from "@/context/RestaurantContext";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import { ClockIcon, CheckIcon, BagIcon } from "@/components/icons";

const TABS: { key: DashboardOrderStatus | "ALL"; label: string }[] = [
    { key: "ALL", label: "Toutes" },
    { key: "PENDING", label: "En attente" },
    { key: "ACCEPTED", label: "En préparation" },
    { key: "READY", label: "Prêtes" },
    { key: "REFUSED", label: "Refusées" },
    { key: "DELIVERED", label: "Livrées" },
];

export default function RestaurantOrdersPage() {
    const { orders, acceptOrder, refuseOrder, markReady } = useRestaurant();
    const [tab, setTab] = useState<DashboardOrderStatus | "ALL">("ALL");
    const [acceptingId, setAcceptingId] = useState<string | null>(null);
    const [prepMinutes, setPrepMinutes] = useState("20");

    const filtered = tab === "ALL" ? orders : orders.filter((o) => o.status === tab);
    const sortedOrders = [...filtered].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const pendingCount = orders.filter((o) => o.status === "PENDING").length;

    const handleAccept = () => {
        if (!acceptingId) return;
        acceptOrder(acceptingId, parseInt(prepMinutes) || 20);
        setAcceptingId(null);
    };

    return (
        <div className="flex flex-col gap-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900">Commandes</h1>
                    {pendingCount > 0 && (
                        <p className="text-sm text-orange-600 font-semibold mt-0.5">
                            {pendingCount} commande{pendingCount > 1 ? "s" : ""} en attente de réponse
                        </p>
                    )}
                </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
                {TABS.map(({ key, label }) => {
                    const count = key === "ALL" ? orders.length : orders.filter((o) => o.status === key).length;
                    return (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            className={`cursor-pointer shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                tab === key
                                    ? "text-white shadow-sm"
                                    : "bg-white border border-stone-200 text-stone-600 hover:border-accent hover:text-accent"
                            }`}
                            style={tab === key ? { background: "linear-gradient(to right, var(--primary), var(--accent))" } : undefined}
                        >
                            {label} {count > 0 && <span className="ml-1 opacity-80">({count})</span>}
                        </button>
                    );
                })}
            </div>
            {sortedOrders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-stone-200 p-12 flex flex-col items-center gap-3 text-center">
                    <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center text-stone-300">
                        <BagIcon size={28} />
                    </div>
                    <p className="text-stone-500 font-semibold">Aucune commande dans cette catégorie</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {sortedOrders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onAccept={() => { setAcceptingId(order.id); setPrepMinutes("20"); }}
                            onRefuse={() => refuseOrder(order.id)}
                            onReady={() => markReady(order.id)}
                        />
                    ))}
                </div>
            )}
            <Modal
                open={acceptingId !== null}
                onClose={() => setAcceptingId(null)}
                title="Accepter la commande"
            >
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-stone-600">
                        Indiquez le temps de préparation estimé pour cette commande.
                    </p>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-stone-700">
                            Temps de préparation (minutes)
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                min="5"
                                max="120"
                                value={prepMinutes}
                                onChange={(e) => setPrepMinutes(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-accent outline-none text-sm"
                            />
                            <div className="shrink-0 flex items-center gap-1 text-stone-400">
                                <ClockIcon size={16} />
                                <span className="text-sm">min</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => setAcceptingId(null)}
                            className="cursor-pointer flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm font-semibold hover:border-stone-300 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleAccept}
                            className="cursor-pointer flex-[2] py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:shadow-md"
                            style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                        >
                            Confirmer l&apos;acceptation
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

function OrderCard({
    order,
    onAccept,
    onRefuse,
    onReady,
}: {
    order: DashboardOrder;
    onAccept: () => void;
    onRefuse: () => void;
    onReady: () => void;
}) {
    const ago = formatAgo(order.createdAt);

    return (
        <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${order.status === "PENDING" ? "border-orange-200" : "border-stone-100"}`}>
            <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-stone-50">
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-stone-900">{order.customerName}</p>
                        <StatusBadge status={order.status} size="sm" />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-0.5">
                        <ClockIcon size={12} />
                        <span>{ago}</span>
                        {order.estimatedMinutes && (
                            <span className="ml-2 text-blue-600 font-semibold">· ~{order.estimatedMinutes} min de préparation</span>
                        )}
                    </div>
                </div>
                <span className="text-base font-bold text-stone-900 shrink-0">{order.total.toFixed(2)} €</span>
            </div>
            <div className="px-5 py-3 flex flex-col gap-1.5">
                {order.items.map((item) => (
                    <div key={item.foodId} className="flex items-center justify-between text-sm">
                        <span className="text-stone-600">
                            <span className="font-semibold text-stone-800">{item.quantity}×</span> {item.name}
                        </span>
                        <span className="text-stone-500">{(item.price * item.quantity).toFixed(2)} €</span>
                    </div>
                ))}
                <p className="text-xs text-stone-400 mt-1">{order.address}</p>
            </div>
            {order.status === "PENDING" && (
                <div className="flex gap-2 px-5 pb-4">
                    <button
                        onClick={onRefuse}
                        className="cursor-pointer flex-1 py-2 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors"
                    >
                        Refuser
                    </button>
                    <button
                        onClick={onAccept}
                        className="cursor-pointer flex-[2] py-2 rounded-xl text-sm font-bold text-white transition-all hover:shadow-md"
                        style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                    >
                        Accepter
                    </button>
                </div>
            )}
            {order.status === "ACCEPTED" && (
                <div className="px-5 pb-4">
                    <button
                        onClick={onReady}
                        className="cursor-pointer w-full py-2 rounded-xl border border-green-200 text-green-700 bg-green-50 text-sm font-bold hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <CheckIcon size={16} />
                        Marquer comme prête
                    </button>
                </div>
            )}
        </div>
    );
}

function formatAgo(date: Date): string {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return "Il y a quelques secondes";
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `Il y a ${mins} min`;
    const hours = Math.floor(mins / 60);
    return `Il y a ${hours}h`;
}
