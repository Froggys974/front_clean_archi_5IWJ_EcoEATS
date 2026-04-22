"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useOrder, OrderAddress } from "@/context/OrderContext";
import { CheckIcon, MapPinIcon, CreditCardIcon } from "@/components/icons";

const DELIVERY_FEE = 2.5;
const SERVICE_FEE = 0.5;

type Step = "address" | "payment" | "confirm";

const STEPS: { key: Step; label: string }[] = [
    { key: "address", label: "Adresse" },
    { key: "payment", label: "Paiement" },
    { key: "confirm", label: "Confirmation" },
];

export default function CheckoutPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const { items, restaurantId, restaurantName, subtotal, clearCart } = useCart();
    const { createOrder } = useOrder();
    const router = useRouter();

    const [step, setStep] = useState<Step>("address");
    const [address, setAddress] = useState<OrderAddress>({
        street: "",
        city: "",
        zip: "",
        instructions: "",
    });
    const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) router.push("/login");
        if (!isLoading && isAuthenticated && items.length === 0) router.push("/restaurants");
    }, [isLoading, isAuthenticated, items.length, router]);

    if (isLoading || !isAuthenticated || items.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent" />
            </div>
        );
    }

    const total = subtotal + DELIVERY_FEE + SERVICE_FEE;
    const stepIndex = STEPS.findIndex((s) => s.key === step);

    const validateAddress = () => {
        const e: Record<string, string> = {};
        if (!address.street.trim()) e.street = "Adresse requise";
        if (!address.city.trim()) e.city = "Ville requise";
        if (!address.zip.trim()) e.zip = "Code postal requis";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const validatePayment = () => {
        const e: Record<string, string> = {};
        const num = card.number.replace(/\s/g, "");
        if (num.length !== 16) e.number = "Numéro de carte invalide (16 chiffres)";
        if (!/^\d{2}\/\d{2}$/.test(card.expiry)) e.expiry = "Format MM/AA requis";
        if (card.cvv.length < 3) e.cvv = "CVV invalide";
        if (!card.name.trim()) e.name = "Nom requis";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleAddressNext = () => {
        if (validateAddress()) {
            setErrors({});
            setStep("payment");
        }
    };

    const handlePaymentSubmit = async () => {
        if (!validatePayment()) return;
        setIsSubmitting(true);

        await new Promise((r) => setTimeout(r, 1200));

        const order = createOrder({
            restaurantId: restaurantId!,
            restaurantName,
            items: [...items],
            address,
            subtotal,
            deliveryFee: DELIVERY_FEE,
            serviceFee: SERVICE_FEE,
            total,
        });

        clearCart();
        setIsSubmitting(false);
        router.push(`/orders/${order.id}`);
    };

    const formatCardNumber = (v: string) => {
        const digits = v.replace(/\D/g, "").slice(0, 16);
        return digits.replace(/(.{4})/g, "$1 ").trim();
    };

    const formatExpiry = (v: string) => {
        const digits = v.replace(/\D/g, "").slice(0, 4);
        if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
        return digits;
    };

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-0 mb-10">
                    {STEPS.map((s, i) => (
                        <div key={s.key} className="flex items-center">
                            <div className="flex flex-col items-center gap-1.5">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                        i < stepIndex
                                            ? "bg-accent text-white"
                                            : i === stepIndex
                                            ? "text-white"
                                            : "bg-stone-200 text-stone-400"
                                    }`}
                                    style={i === stepIndex ? { background: "linear-gradient(135deg, var(--primary), var(--accent))" } : undefined}
                                >
                                    {i < stepIndex ? <CheckIcon size={14} /> : i + 1}
                                </div>
                                <span className={`text-xs font-semibold ${i === stepIndex ? "text-accent" : "text-stone-400"}`}>
                                    {s.label}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`h-0.5 w-16 sm:w-24 mx-2 mb-5 ${i < stepIndex ? "bg-accent" : "bg-stone-200"}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {step === "address" && (
                            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex flex-col gap-5">
                                <div className="flex items-center gap-2 mb-1">
                                    <MapPinIcon size={20} className="text-accent" />
                                    <h2 className="text-lg font-bold text-stone-900">Adresse de livraison</h2>
                                </div>

                                <Field label="Adresse" error={errors.street}>
                                    <input
                                        type="text"
                                        value={address.street}
                                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                        placeholder="12 rue de la Paix"
                                        className={inputClass(!!errors.street)}
                                    />
                                </Field>

                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Ville" error={errors.city}>
                                        <input
                                            type="text"
                                            value={address.city}
                                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                            placeholder="Paris"
                                            className={inputClass(!!errors.city)}
                                        />
                                    </Field>
                                    <Field label="Code postal" error={errors.zip}>
                                        <input
                                            type="text"
                                            value={address.zip}
                                            onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                                            placeholder="75001"
                                            className={inputClass(!!errors.zip)}
                                        />
                                    </Field>
                                </div>

                                <Field label="Instructions (optionnel)" error="">
                                    <textarea
                                        value={address.instructions}
                                        onChange={(e) => setAddress({ ...address, instructions: e.target.value })}
                                        placeholder="Digicode, étage, instructions particulières…"
                                        rows={3}
                                        className={`${inputClass(false)} resize-none`}
                                    />
                                </Field>

                                <button
                                    onClick={handleAddressNext}
                                    className="cursor-pointer w-full py-3.5 rounded-xl font-bold text-white text-base transition-all hover:shadow-lg hover:scale-[1.01] active:scale-95"
                                    style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                                >
                                    Continuer vers le paiement
                                </button>
                            </div>
                        )}
                        {step === "payment" && (
                            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex flex-col gap-5">
                                <div className="flex items-center gap-2 mb-1">
                                    <CreditCardIcon size={20} className="text-accent" />
                                    <h2 className="text-lg font-bold text-stone-900">Paiement simulé</h2>
                                </div>
                                <p className="text-sm text-stone-400 -mt-3">Aucune donnée réelle n'est transmise. Simulation uniquement.</p>

                                <Field label="Titulaire de la carte" error={errors.name}>
                                    <input
                                        type="text"
                                        value={card.name}
                                        onChange={(e) => setCard({ ...card, name: e.target.value })}
                                        placeholder="Jean Dupont"
                                        className={inputClass(!!errors.name)}
                                    />
                                </Field>

                                <Field label="Numéro de carte" error={errors.number}>
                                    <input
                                        type="text"
                                        value={card.number}
                                        onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength={19}
                                        className={`${inputClass(!!errors.number)} font-mono tracking-widest`}
                                    />
                                </Field>

                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Date d'expiration" error={errors.expiry}>
                                        <input
                                            type="text"
                                            value={card.expiry}
                                            onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                                            placeholder="MM/AA"
                                            maxLength={5}
                                            className={`${inputClass(!!errors.expiry)} font-mono`}
                                        />
                                    </Field>
                                    <Field label="CVV" error={errors.cvv}>
                                        <input
                                            type="text"
                                            value={card.cvv}
                                            onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                                            placeholder="123"
                                            maxLength={4}
                                            className={`${inputClass(!!errors.cvv)} font-mono`}
                                        />
                                    </Field>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                    <button
                                        onClick={() => { setErrors({}); setStep("address"); }}
                                        className="cursor-pointer flex-1 py-3 rounded-xl border border-stone-200 text-stone-600 text-sm font-semibold hover:border-accent hover:text-accent transition-colors"
                                    >
                                        ← Retour
                                    </button>
                                    <button
                                        onClick={handlePaymentSubmit}
                                        disabled={isSubmitting}
                                        className="cursor-pointer flex-[2] py-3.5 rounded-xl font-bold text-white text-base transition-all hover:shadow-lg hover:scale-[1.01] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
                                        style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                                                Traitement…
                                            </span>
                                        ) : (
                                            `Payer ${total.toFixed(2)} €`
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex flex-col gap-4 sticky top-24">
                            <h3 className="font-bold text-stone-900">Récapitulatif</h3>
                            <p className="text-xs text-stone-400 font-medium -mt-2">{restaurantName}</p>

                            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.foodId} className="flex items-center justify-between gap-2 text-sm">
                                        <span className="text-stone-600 min-w-0 truncate">
                                            <span className="font-semibold text-stone-800">{item.quantity}×</span> {item.name}
                                        </span>
                                        <span className="text-stone-700 font-medium shrink-0">
                                            {(item.price * item.quantity).toFixed(2)} €
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-stone-100 pt-3 flex flex-col gap-1.5">
                                <FeeRow label="Sous-total" value={subtotal} />
                                <FeeRow label="Livraison" value={DELIVERY_FEE} />
                                <FeeRow label="Service" value={SERVICE_FEE} />
                                <div className="flex justify-between font-bold text-stone-900 text-base pt-2 border-t border-stone-200 mt-1">
                                    <span>Total</span>
                                    <span>{total.toFixed(2)} €</span>
                                </div>
                            </div>

                            {step === "payment" && address.street && (
                                <div className="bg-stone-50 rounded-xl p-3 text-xs text-stone-500">
                                    <p className="font-semibold text-stone-700 mb-1">Livraison à</p>
                                    <p>{address.street}</p>
                                    <p>{address.zip} {address.city}</p>
                                    {address.instructions && <p className="mt-1 italic">{address.instructions}</p>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Field({ label, error, children }: { label: string; error: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-stone-700">{label}</label>
            {children}
            {error && <p className="text-xs text-red-500">{error}</p>}
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

function inputClass(hasError: boolean) {
    return `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
        hasError
            ? "border-red-300 focus:border-red-400 bg-red-50"
            : "border-stone-200 focus:border-accent bg-white"
    }`;
}
