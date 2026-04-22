"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useOrder } from "@/context/OrderContext";
import { BagIcon } from "@/components/icons";

const STATUS_LABELS: Record<string, string> = {
    PENDING: "En attente",
    ACCEPTED: "Acceptée",
    PREPARING: "En préparation",
    READY: "Prête pour collecte",
    DELIVERING: "En livraison",
    DELIVERED: "Livrée",
};

const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-stone-100 text-stone-600",
    ACCEPTED: "bg-blue-100 text-blue-700",
    PREPARING: "bg-primary/20 text-yellow-700",
    READY: "bg-primary/30 text-yellow-800",
    DELIVERING: "bg-accent/10 text-accent",
    DELIVERED: "bg-green-100 text-green-700",
};

export default function OrdersPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const { orders } = useOrder();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
            <div className="max-w-2xl mx-auto flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <Link
                        href="/profile"
                        className="text-stone-400 hover:text-accent transition-colors text-sm"
                    >
                        ← Profil
                    </Link>
                    <span className="text-stone-300">/</span>
                    <h1 className="text-2xl font-bold text-stone-900">Mes commandes</h1>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-10 flex flex-col items-center gap-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-300">
                            <BagIcon size={32} />
                        </div>
                        <div>
                            <p className="text-stone-700 font-semibold">Aucune commande pour le moment</p>
                            <p className="text-stone-400 text-sm mt-1">Vos commandes apparaîtront ici après votre premier achat.</p>
                        </div>
                        <Link
                            href="/restaurants"
                            className="mt-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:shadow-md"
                            style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                        >
                            Découvrir les restaurants
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {[...orders].reverse().map((order) => (
                            <Link
                                key={order.id}
                                href={`/orders/${order.id}`}
                                className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex flex-col gap-3 hover:border-accent transition-colors group"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-bold text-stone-900">{order.restaurantName}</p>
                                        <p className="text-xs text-stone-400 mt-0.5">
                                            {order.createdAt.toLocaleDateString("fr-FR", {
                                                day: "numeric",
                                                month: "long",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${STATUS_COLORS[order.status] ?? "bg-stone-100 text-stone-600"}`}>
                                        {STATUS_LABELS[order.status] ?? order.status}
                                    </span>
                                </div>
                                <div className="text-sm text-stone-500">
                                    {order.items.map((item) => `${item.quantity}× ${item.name}`).join(", ")}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-stone-900">{order.total.toFixed(2)} €</span>
                                    <span className="text-xs text-accent font-semibold group-hover:underline">Voir le détail →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
