"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCourier } from "@/context/CourierContext";
import StatusBadge from "@/components/ui/StatusBadge";
import { TruckIcon, WalletIcon, ScooterIcon, ToggleIcon } from "@/components/icons";

export default function CourierDashboardPage() {
    const { user } = useAuth();
    const { isAvailable, setAvailable, activeDelivery, pendingDeliveries, history, walletBalance } = useCourier();

    const displayName = user?.firstName
        ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
        : "Livreur";

    const todayEarnings = history
        .filter((d) => {
            const h = new Date(d.createdAt);
            const now = new Date();
            return h.toDateString() === now.toDateString();
        })
        .reduce((acc, d) => acc + d.fee + d.tip, 0);

    return (
        <div className="flex flex-col gap-6 max-w-3xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900">Bonjour, {displayName}</h1>
                    <p className="text-stone-400 text-sm mt-0.5">Tableau de bord livreur</p>
                </div>
                <button
                    onClick={() => setAvailable(!isAvailable)}
                    className={`cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isAvailable
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                    }`}
                >
                    <ToggleIcon size={18} />
                    {isAvailable ? "Disponible" : "Indisponible"}
                </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 flex flex-col gap-1">
                    <span className="text-2xl font-bold text-orange-500">{pendingDeliveries.length}</span>
                    <span className="text-xs text-stone-500 font-medium">Propositions</span>
                </div>
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 flex flex-col gap-1">
                    <span className="text-2xl font-bold text-blue-500">{history.length}</span>
                    <span className="text-xs text-stone-500 font-medium">Livraisons totales</span>
                </div>
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 flex flex-col gap-1 col-span-2 sm:col-span-1">
                    <span className="text-2xl font-bold text-green-600">{todayEarnings.toFixed(2)} €</span>
                    <span className="text-xs text-stone-500 font-medium">Gains aujourd'hui</span>
                </div>
            </div>
            {activeDelivery && (
                <div className="bg-white rounded-2xl border-2 border-accent shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <ScooterIcon size={20} className="text-accent" />
                        <h2 className="font-bold text-stone-900">Livraison en cours</h2>
                        <StatusBadge status={activeDelivery.status === "ACCEPTED" ? "DELIVERING" : "DELIVERING"} size="sm" />
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-stone-400">Restaurant</span>
                            <span className="font-semibold text-stone-900">{activeDelivery.restaurantName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-stone-400">Client</span>
                            <span className="font-semibold text-stone-900">{activeDelivery.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-stone-400">Adresse</span>
                            <span className="font-semibold text-stone-900 text-right max-w-[200px]">{activeDelivery.customerAddress}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-stone-400">Gain</span>
                            <span className="font-bold text-accent">{(activeDelivery.fee + activeDelivery.tip).toFixed(2)} €</span>
                        </div>
                    </div>
                    <Link
                        href="/dashboard/courier/deliveries"
                        className="mt-4 block text-center py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:shadow-md"
                        style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                    >
                        Gérer la livraison
                    </Link>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                    href="/dashboard/courier/deliveries"
                    className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex items-center gap-4 hover:border-accent transition-colors group"
                >
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                        <TruckIcon size={24} />
                    </div>
                    <div>
                        <p className="font-bold text-stone-900 group-hover:text-accent transition-colors">Livraisons</p>
                        <p className="text-sm text-stone-400">{pendingDeliveries.length} proposition{pendingDeliveries.length !== 1 ? "s" : ""}</p>
                    </div>
                </Link>
                <Link
                    href="/dashboard/courier/wallet"
                    className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex items-center gap-4 hover:border-accent transition-colors group"
                >
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                        <WalletIcon size={24} />
                    </div>
                    <div>
                        <p className="font-bold text-stone-900 group-hover:text-accent transition-colors">Portefeuille</p>
                        <p className="text-sm text-stone-400">{walletBalance.toFixed(2)} € disponibles</p>
                    </div>
                </Link>
            </div>
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
                    <h2 className="font-bold text-stone-900">Dernières livraisons</h2>
                    <Link href="/dashboard/courier/deliveries" className="text-sm text-accent font-semibold hover:underline">
                        Tout voir →
                    </Link>
                </div>
                <div className="divide-y divide-stone-50">
                    {history.slice(0, 4).map((d) => (
                        <div key={d.id} className="flex items-center justify-between px-5 py-3 gap-4">
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-stone-900">{d.customerName}</p>
                                <p className="text-xs text-stone-400 truncate">{d.restaurantName} · {d.distance} km</p>
                            </div>
                            <span className="text-sm font-bold text-green-600 shrink-0">+{(d.fee + d.tip).toFixed(2)} €</span>
                        </div>
                    ))}
                    {history.length === 0 && (
                        <div className="flex items-center justify-center py-10 text-stone-400 text-sm">
                            Aucune livraison effectuée.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
