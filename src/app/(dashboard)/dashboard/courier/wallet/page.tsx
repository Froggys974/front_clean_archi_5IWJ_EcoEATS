"use client";

import { useCourier } from "@/context/CourierContext";
import { WalletIcon, TruckIcon } from "@/components/icons";

export default function CourierWalletPage() {
    const { walletBalance, history } = useCourier();

    const totalFees = history.reduce((acc, d) => acc + d.fee, 0);
    const totalTips = history.reduce((acc, d) => acc + d.tip, 0);
    const totalEarned = totalFees + totalTips;

    const todayEarnings = history
        .filter((d) => new Date(d.createdAt).toDateString() === new Date().toDateString())
        .reduce((acc, d) => acc + d.fee + d.tip, 0);

    return (
        <div className="flex flex-col gap-6 max-w-2xl">
            <h1 className="text-2xl font-bold text-stone-900">Portefeuille</h1>
            <div
                className="rounded-2xl p-6 text-white flex flex-col gap-1"
                style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)" }}
            >
                <div className="flex items-center gap-2 opacity-80 mb-1">
                    <WalletIcon size={18} />
                    <span className="text-sm font-semibold">Solde disponible</span>
                </div>
                <p className="text-4xl font-bold">{walletBalance.toFixed(2)} €</p>
                <p className="text-sm opacity-70 mt-1">Mis à jour en temps réel</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <StatCard label="Gains aujourd'hui" value={`${todayEarnings.toFixed(2)} €`} color="text-green-600" />
                <StatCard label="Total frais livraison" value={`${totalFees.toFixed(2)} €`} color="text-accent" />
                <StatCard label="Total pourboires" value={`${totalTips.toFixed(2)} €`} color="text-blue-600" />
            </div>
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex flex-col gap-3">
                <h2 className="font-bold text-stone-900">Répartition des gains</h2>
                <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-stone-50">
                        <span className="text-stone-500">Frais de livraison</span>
                        <span className="font-semibold text-stone-900">{totalFees.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-stone-50">
                        <span className="text-stone-500">Pourboires clients</span>
                        <span className="font-semibold text-stone-900">{totalTips.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="font-bold text-stone-900">Total gagné</span>
                        <span className="font-bold text-accent">{totalEarned.toFixed(2)} €</span>
                    </div>
                </div>
                <p className="text-xs text-stone-400 mt-1">
                    Les pourboires sont intégralement reversés au livreur, sans commission plateforme.
                </p>
            </div>
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-stone-100">
                    <h2 className="font-bold text-stone-900">Historique des transactions</h2>
                </div>
                <div className="divide-y divide-stone-50">
                    {history.length === 0 ? (
                        <div className="flex items-center justify-center py-10 text-stone-400 text-sm">
                            Aucune transaction pour le moment.
                        </div>
                    ) : (
                        history.map((d) => (
                            <div key={d.id} className="flex items-center gap-4 px-5 py-4">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                                    <TruckIcon size={18} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-stone-900">{d.restaurantName}</p>
                                    <p className="text-xs text-stone-400 truncate">
                                        {d.customerName} · {d.distance} km · pourboire {d.tip.toFixed(2)} €
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-bold text-green-600">+{(d.fee + d.tip).toFixed(2)} €</p>
                                    <p className="text-xs text-stone-400">{formatRelative(d.createdAt)}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 flex flex-col gap-1">
            <span className={`text-xl font-bold ${color}`}>{value}</span>
            <span className="text-xs text-stone-500 font-medium">{label}</span>
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
