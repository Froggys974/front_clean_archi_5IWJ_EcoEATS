"use client";

import Link from "next/link";
import { useRestaurant } from "@/context/RestaurantContext";
import StatusBadge from "@/components/ui/StatusBadge";
import { BagIcon, CartIcon, StarIcon } from "@/components/icons";

export default function RestaurantDashboardPage() {
    const { restaurant, dishes, orders } = useRestaurant();

    const pending = orders.filter((o) => o.status === "PENDING").length;
    const accepted = orders.filter((o) => o.status === "ACCEPTED").length;
    const ready = orders.filter((o) => o.status === "READY").length;
    const stockAlerts = dishes.filter((d) => (d.dailyStock ?? 10) <= 3).length;

    return (
        <div className="flex flex-col gap-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold text-stone-900">{restaurant?.name ?? "Mon restaurant"}</h1>
                <p className="text-stone-400 text-sm mt-0.5">{restaurant?.address}, {restaurant?.city}</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard label="Commandes en attente" value={pending} color="text-orange-600" bg="bg-orange-50" />
                <KpiCard label="En préparation" value={accepted} color="text-blue-600" bg="bg-blue-50" />
                <KpiCard label="Prêtes à collecter" value={ready} color="text-green-600" bg="bg-green-50" />
                <KpiCard label="Alertes stock" value={stockAlerts} color="text-red-600" bg="bg-red-50" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                    href="/dashboard/restaurant/orders"
                    className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex items-center gap-4 hover:border-accent transition-colors group"
                >
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                        <BagIcon size={24} />
                    </div>
                    <div>
                        <p className="font-bold text-stone-900 group-hover:text-accent transition-colors">Gérer les commandes</p>
                        <p className="text-sm text-stone-400">{pending} en attente de réponse</p>
                    </div>
                </Link>
                <Link
                    href="/dashboard/restaurant/menu"
                    className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex items-center gap-4 hover:border-accent transition-colors group"
                >
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-yellow-700">
                        <CartIcon size={24} />
                    </div>
                    <div>
                        <p className="font-bold text-stone-900 group-hover:text-accent transition-colors">Gérer le menu</p>
                        <p className="text-sm text-stone-400">{dishes.length} plat{dishes.length !== 1 ? "s" : ""} au catalogue</p>
                    </div>
                </Link>
            </div>
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
                    <h2 className="font-bold text-stone-900">Commandes récentes</h2>
                    <Link href="/dashboard/restaurant/orders" className="text-sm text-accent font-semibold hover:underline">
                        Tout voir →
                    </Link>
                </div>
                <div className="divide-y divide-stone-50">
                    {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between px-5 py-3 gap-4">
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-stone-900">{order.customerName}</p>
                                <p className="text-xs text-stone-400 truncate">
                                    {order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <span className="text-sm font-bold text-stone-900">{order.total.toFixed(2)} €</span>
                                <StatusBadge status={order.status} size="sm" />
                            </div>
                        </div>
                    ))}
                    {orders.length === 0 && (
                        <div className="flex items-center justify-center py-10 text-stone-400 text-sm">
                            Aucune commande pour le moment.
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex items-center gap-4">
                <div
                    className="w-16 h-16 rounded-xl bg-stone-100 shrink-0 overflow-hidden"
                    style={restaurant?.image ? { backgroundImage: `url(${restaurant.image})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
                />
                <div className="min-w-0 flex-1">
                    <p className="font-bold text-stone-900">{restaurant?.name}</p>
                    <p className="text-sm text-stone-500">{restaurant?.address}, {restaurant?.city}</p>
                    <div className="flex items-center gap-1 mt-1">
                        <StarIcon size={14} className="text-yellow-400" />
                        <span className="text-sm font-semibold text-stone-700">{restaurant?.rating}</span>
                        <span className="text-xs text-stone-400 ml-2">· Livraison ~{restaurant?.maxDeliveryTime} min</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function KpiCard({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
    return (
        <div className={`rounded-2xl border border-stone-100 shadow-sm p-4 flex flex-col gap-1 bg-white`}>
            <span className={`text-2xl font-bold ${color}`}>{value}</span>
            <span className="text-xs text-stone-500 font-medium">{label}</span>
        </div>
    );
}
