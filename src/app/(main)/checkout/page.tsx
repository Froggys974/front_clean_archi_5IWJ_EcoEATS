"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";
import { useDeliveryAddress } from "@/hooks/useDeliveryAddress";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { SelectedAddress } from "@/types/address";
import { CheckIcon, CreditCardIcon, MapPinIcon } from "@/components/icons";
import { SERVICE_FEE, DELIVERY_FEE } from "@/constants/fees";

type Step = "address" | "payment" | "confirm";

const STEPS: { key: Step; label: string }[] = [
  { key: "address", label: "Adresse" },
  { key: "payment", label: "Paiement" },
  { key: "confirm", label: "Confirmation" },
];

export default function CheckoutPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { items, restaurantName, subtotal, clearCart, cartId } = useCart();
  const { createOrder } = useOrder();
  const { selectedAddress: savedAddress } = useDeliveryAddress();
  const router = useRouter();

  const [step, setStep] = useState<Step>("address");
  const [addressInput, setAddressInput] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress | null>(null);
  const [instructions, setInstructions] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectingToOrder = useRef(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login");
    if (!isLoading && isAuthenticated && items.length === 0 && !redirectingToOrder.current)
      router.push("/restaurants");
  }, [isLoading, isAuthenticated, items.length, router]);

  useEffect(() => {
    if (savedAddress && !selectedAddress) {
      setSelectedAddress(savedAddress);
      setAddressInput(savedAddress.label);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedAddress]);

  if (isLoading || !isAuthenticated || items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent" />
      </div>
    );
  }

  const estimatedTotal = subtotal + DELIVERY_FEE + SERVICE_FEE + tipAmount;
  const stepIndex = STEPS.findIndex((s) => s.key === step);

  function validateAddress(): boolean {
    if (!selectedAddress) {
      setErrors({ address: "Veuillez sélectionner une adresse dans la liste" });
      return false;
    }
    setErrors({});
    return true;
  }

  function validatePayment(): boolean {
    const e: Record<string, string> = {};
    const num = card.number.replace(/\s/g, "");
    if (num.length !== 16) e.number = "Numéro de carte invalide (16 chiffres)";
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) e.expiry = "Format MM/AA requis";
    if (card.cvv.length < 3) e.cvv = "CVV invalide";
    if (!card.name.trim()) e.name = "Nom requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleAddressNext() {
    if (validateAddress()) setStep("payment");
  }

  async function handlePaymentSubmit() {
    if (!validatePayment() || !selectedAddress || !cartId) return;
    setIsSubmitting(true);
    try {
      const order = await createOrder({
        cartId: cartId!,
        address: {
          street: selectedAddress.street,
          city: selectedAddress.city,
          zip: selectedAddress.postalCode,
          instructions: instructions || undefined,
          lat: selectedAddress.lat,
          lng: selectedAddress.lng,
        },
        restaurantName,
        tipAmount: tipAmount > 0 ? tipAmount : undefined,
      });
      redirectingToOrder.current = true;
      clearCart();
      router.push(`/orders/${order.id}`);
    } catch {
      setErrors({ submit: "Erreur lors de la commande. Veuillez réessayer." });
    } finally {
      setIsSubmitting(false);
    }
  }

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Step indicators */}
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
                  style={
                    i === stepIndex
                      ? { background: "linear-gradient(135deg, var(--primary), var(--accent))" }
                      : undefined
                  }
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

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-stone-700">Adresse</label>
                  <AddressAutocomplete
                    value={addressInput}
                    onChange={(raw) => {
                      setAddressInput(raw);
                      setSelectedAddress(null);
                    }}
                    onSelect={(address) => {
                      setSelectedAddress(address);
                      setAddressInput(address.label);
                    }}
                    hasError={!!errors.address}
                    placeholder="12 rue de la Paix, Paris"
                  />
                  {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-stone-700">
                    Instructions <span className="font-normal text-stone-400">(optionnel)</span>
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Digicode, étage, instructions particulières…"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-accent text-sm outline-none transition-colors resize-none bg-white"
                  />
                </div>

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
                <p className="text-sm text-stone-400 -mt-3">
                  Aucune donnée réelle n&apos;est transmise. Simulation uniquement.
                </p>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-stone-700">Titulaire de la carte</label>
                  <input
                    type="text"
                    value={card.name}
                    onChange={(e) => setCard({ ...card, name: e.target.value })}
                    placeholder="Jean Dupont"
                    className={inputClass(!!errors.name)}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-stone-700">Numéro de carte</label>
                  <input
                    type="text"
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`${inputClass(!!errors.number)} font-mono tracking-widest`}
                  />
                  {errors.number && <p className="text-xs text-red-500">{errors.number}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-stone-700">Date d&apos;expiration</label>
                    <input
                      type="text"
                      value={card.expiry}
                      onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                      placeholder="MM/AA"
                      maxLength={5}
                      className={`${inputClass(!!errors.expiry)} font-mono`}
                    />
                    {errors.expiry && <p className="text-xs text-red-500">{errors.expiry}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-stone-700">CVV</label>
                    <input
                      type="text"
                      value={card.cvv}
                      onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                      placeholder="123"
                      maxLength={4}
                      className={`${inputClass(!!errors.cvv)} font-mono`}
                    />
                    {errors.cvv && <p className="text-xs text-red-500">{errors.cvv}</p>}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-stone-700">
                    Pourboire livreur{" "}
                    <span className="font-normal text-stone-400">(optionnel — reversé 100% au livreur)</span>
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {[0, 1, 2, 3, 5].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setTipAmount(amount)}
                        className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                          tipAmount === amount
                            ? "border-accent text-accent bg-accent/5"
                            : "border-stone-200 text-stone-500 hover:border-accent hover:text-accent"
                        }`}
                      >
                        {amount === 0 ? "Aucun" : `${amount} €`}
                      </button>
                    ))}
                  </div>
                </div>

                {errors.submit && (
                  <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2.5">{errors.submit}</p>
                )}

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
                      `Payer ~${estimatedTotal.toFixed(2)} €`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
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
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Livraison (estimée)</span>
                  <span>~{DELIVERY_FEE.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Service</span>
                  <span>{SERVICE_FEE.toFixed(2)} €</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Pourboire livreur</span>
                    <span>{tipAmount.toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-stone-900 text-base pt-2 border-t border-stone-200 mt-1">
                  <span>Total estimé</span>
                  <span>~{estimatedTotal.toFixed(2)} €</span>
                </div>
              </div>

              {step === "payment" && selectedAddress && (
                <div className="bg-stone-50 rounded-xl p-3 text-xs text-stone-500">
                  <p className="font-semibold text-stone-700 mb-1">Livraison à</p>
                  <p>{selectedAddress.street}</p>
                  <p>{selectedAddress.postalCode} {selectedAddress.city}</p>
                  {instructions && <p className="mt-1 italic">{instructions}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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
