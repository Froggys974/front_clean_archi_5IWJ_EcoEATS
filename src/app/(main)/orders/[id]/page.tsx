"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useOrder, OrderStatus } from "@/context/OrderContext";
import { CheckIcon, ClockIcon, TruckIcon, BagIcon } from "@/components/icons";

const STATUS_STEPS: { status: OrderStatus; label: string; description: string }[] = [
    { status: "PENDING", label: "Commande reçue", description: "Votre commande est transmise au restaurant." },
    { status: "ACCEPTED", label: "Acceptée", description: "Le restaurant prépare votre commande." },
    { status: "PREPARING", label: "En préparation", description: "Vos plats sont en cours de préparation." },
    { status: "READY", label: "Prête", description: "La commande attend un livreur." },
    { status: "DELIVERING", label: "En livraison", description: "Un livreur est en route vers vous." },
    { status: "DELIVERED", label: "Livrée", description: "Bonne dégustation !" },
];

const STATUS_ORDER: OrderStatus[] = ["PENDING", "ACCEPTED", "PREPARING", "READY", "DELIVERING", "DELIVERED"];

const SIMULATION_DELAYS: number[] = [0, 4000, 8000, 13000, 20000, 30000];

export default function OrderTrackingPage() {
    const { id } = useParams<{ id: string }>();
    const { getOrder, updateStatus } = useOrder();
    const router = useRouter();
    const [tick, setTick] = useState(0);

    const order = getOrder(id);

    useEffect(() => {
        if (!order) return;

        const timers: ReturnType<typeof setTimeout>[] = [];

        STATUS_ORDER.forEach((status, i) => {
            if (i === 0) return;
            const delay = SIMULATION_DELAYS[i];
            const t = setTimeout(() => {
                updateStatus(id, status);
                setTick((n) => n + 1);
            }, delay);
            timers.push(t);
        });

        return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (!order) {
        return (
            <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-300">
                    <BagIcon size={32} />
                </div>
                <p className="text-stone-700 font-semibold">Commande introuvable</p>
                <p className="text-stone-400 text-sm text-center">Cette commande n'existe pas ou a été perdue lors d'un rechargement de page.</p>
                <Link
                    href="/restaurants"
                    className="mt-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
                    style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                >
                    Retour aux restaurants
                </Link>
            </div>
        );
    }

    const currentIndex = STATUS_ORDER.indexOf(order.status);
    const isDelivered = order.status === "DELIVERED";

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
            <div className="max-w-2xl mx-auto flex flex-col gap-6">
                <div>
                    <Link href="/profile/orders" className="text-stone-400 hover:text-accent text-sm transition-colors">
                        ← Mes commandes
                    </Link>
                    <h1 className="text-2xl font-bold text-stone-900 mt-2">Suivi de commande</h1>
                    <p className="text-stone-400 text-sm">
                        {order.restaurantName} · {order.createdAt.toLocaleDateString("fr-FR", {
                            day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
                        })}
                    </p>
                </div>
                <div
                    className="rounded-2xl p-6 text-white"
                    style={{ background: isDelivered ? "linear-gradient(135deg, #22c55e, #16a34a)" : "linear-gradient(135deg, var(--primary), var(--accent))" }}
                >
                    <div className="flex items-center gap-3 mb-1">
                        {isDelivered ? <CheckIcon size={24} /> : <ClockIcon size={24} />}
                        <span className="text-xl font-bold">{STATUS_STEPS[currentIndex]?.label}</span>
                    </div>
                    <p className="text-white/80 text-sm">{STATUS_STEPS[currentIndex]?.description}</p>
                    {!isDelivered && (
                        <div className="mt-4 h-1.5 bg-white/30 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white rounded-full transition-all duration-700"
                                style={{ width: `${((currentIndex + 1) / STATUS_STEPS.length) * 100}%` }}
                            />
                        </div>
                    )}
                </div>
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                    <h2 className="font-bold text-stone-900 mb-5">Étapes</h2>
                    <div className="flex flex-col gap-0">
                        {STATUS_STEPS.map((step, i) => {
                            const done = i <= currentIndex;
                            const active = i === currentIndex;
                            const isLast = i === STATUS_STEPS.length - 1;
                            return (
                                <div key={step.status} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                                                done
                                                    ? active && !isDelivered
                                                        ? "ring-4 ring-accent/20"
                                                        : ""
                                                    : ""
                                            }`}
                                            style={
                                                done
                                                    ? { background: "linear-gradient(135deg, var(--primary), var(--accent))" }
                                                    : undefined
                                            }
                                        >
                                            {done ? (
                                                <CheckIcon size={14} className="text-white" />
                                            ) : (
                                                <div className="w-3 h-3 rounded-full bg-stone-200" />
                                            )}
                                        </div>
                                        {!isLast && (
                                            <div className={`w-0.5 flex-1 min-h-[2rem] my-1 transition-all duration-500 ${done && i < currentIndex ? "bg-accent" : "bg-stone-100"}`} />
                                        )}
                                    </div>
                                    <div className={`pb-4 flex-1 ${isLast ? "" : ""}`}>
                                        <p className={`text-sm font-bold ${done ? "text-stone-900" : "text-stone-300"}`}>
                                            {step.label}
                                        </p>
                                        {done && (
                                            <p className="text-xs text-stone-400 mt-0.5">{step.description}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex flex-col gap-4">
                    <h2 className="font-bold text-stone-900">Détail de la commande</h2>

                    <div className="flex flex-col gap-2">
                        {order.items.map((item) => (
                            <div key={item.foodId} className="flex items-center justify-between text-sm">
                                <span className="text-stone-600">
                                    <span className="font-semibold text-stone-800">{item.quantity}×</span> {item.name}
                                </span>
                                <span className="text-stone-700 font-medium">{(item.price * item.quantity).toFixed(2)} €</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-stone-100 pt-3 flex flex-col gap-1.5">
                        <FeeRow label="Sous-total" value={order.subtotal} />
                        <FeeRow label="Livraison" value={order.deliveryFee} />
                        <FeeRow label="Service" value={order.serviceFee} />
                        <div className="flex justify-between font-bold text-stone-900 text-base pt-2 border-t border-stone-200 mt-1">
                            <span>Total payé</span>
                            <span>{order.total.toFixed(2)} €</span>
                        </div>
                    </div>

                    <div className="bg-stone-50 rounded-xl p-3 text-xs text-stone-500">
                        <p className="font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                            <TruckIcon size={14} className="text-accent" /> Livraison à
                        </p>
                        <p>{order.address.street}</p>
                        <p>{order.address.zip} {order.address.city}</p>
                        {order.address.instructions && (
                            <p className="mt-1 italic">{order.address.instructions}</p>
                        )}
                    </div>
                </div>

                {isDelivered && (
                    <Link
                        href="/restaurants"
                        className="block w-full py-3.5 rounded-xl text-center font-bold text-white text-base transition-all hover:shadow-lg hover:scale-[1.01] active:scale-95"
                        style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                    >
                        Commander à nouveau
                    </Link>
                )}
            </div>
        </div>
    );
}

function FeeRow({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex justify-between text-sm text-stone-500">
            <span>{label}</span>
            <span>{value.toFixed(2)} €</span>
        </div>
    );
}
