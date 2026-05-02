"use client";

import { useEffect, useMemo, useState } from "react";
import { useRestaurant } from "@/context/RestaurantContext";
import { OpeningHour } from "@/types/food";

type DayOption = { day: number; label: string };

const DAYS: DayOption[] = [
    { day: 1, label: "Lundi" },
    { day: 2, label: "Mardi" },
    { day: 3, label: "Mercredi" },
    { day: 4, label: "Jeudi" },
    { day: 5, label: "Vendredi" },
    { day: 6, label: "Samedi" },
    { day: 0, label: "Dimanche" },
];

export default function RestaurantSettingsPage() {
    const { restaurant, offers, updateRestaurant, addOffer } = useRestaurant();

    const [status, setStatus] = useState<'' | 'OPEN' | 'CLOSED' | 'TEMPORARILY_CLOSED'>('');
    const [hours, setHours] = useState<OpeningHour[]>(() => restaurant?.OpeningHours ?? []);
    const [savingSettings, setSavingSettings] = useState(false);

    const [offerLabel, setOfferLabel] = useState('');
    const [offerDiscount, setOfferDiscount] = useState(10);
    const [offerImageUrl, setOfferImageUrl] = useState('');
    const [savingOffer, setSavingOffer] = useState(false);
    const [settingsMsg, setSettingsMsg] = useState<string | null>(null);
    const [offerMsg, setOfferMsg] = useState<string | null>(null);

    const groupedHours = useMemo(() => {
        const byDay = new Map<number, OpeningHour>();
        for (const slot of hours) {
            byDay.set(slot.day, slot);
        }
        return byDay;
    }, [hours]);

    useEffect(() => {
        if (restaurant?.OpeningHours) {
            setHours(restaurant.OpeningHours);
        }
    }, [restaurant]);

    const setDayHours = (day: number, patch: Partial<OpeningHour>) => {
        const current = groupedHours.get(day) ?? { day, open: '09:00', close: '22:00' };
        const next = { ...current, ...patch };
        const withoutDay = hours.filter((h) => h.day !== day);
        setHours([...withoutDay, next].sort((a, b) => a.day - b.day));
    };

    const handleSaveSettings = async () => {
        setSettingsMsg(null);
        setSavingSettings(true);
        try {
            await updateRestaurant({ status: status || undefined, openingHours: hours });
            setSettingsMsg('Paramètres restaurant enregistrés.');
        } catch (error) {
            setSettingsMsg(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde.');
        } finally {
            setSavingSettings(false);
        }
    };

    const handleAddOffer = async (e: React.FormEvent) => {
        e.preventDefault();
        setOfferMsg(null);

        if (!offerLabel.trim()) {
            setOfferMsg('Le libellé de l\'offre est requis.');
            return;
        }

        if (offerDiscount < 1 || offerDiscount > 100) {
            setOfferMsg('La réduction doit être entre 1 et 100.');
            return;
        }

        setSavingOffer(true);
        try {
            await addOffer({
                label: offerLabel.trim(),
                discountPercent: offerDiscount,
                imageUrl: offerImageUrl.trim() || undefined,
            });
            setOfferLabel('');
            setOfferDiscount(10);
            setOfferImageUrl('');
            setOfferMsg('Offre créée avec succès.');
        } catch (error) {
            setOfferMsg(error instanceof Error ? error.message : 'Erreur lors de la création de l\'offre.');
        } finally {
            setSavingOffer(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-5xl">
            <div>
                <h1 className="text-2xl font-bold text-stone-900">Offres & paramètres restaurant</h1>
                <p className="text-stone-400 text-sm mt-0.5">Configurez vos horaires, votre statut et vos promotions.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <section className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-stone-900">Statut & horaires</h2>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-stone-700">Statut du restaurant</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as '' | 'OPEN' | 'CLOSED' | 'TEMPORARILY_CLOSED')}
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-accent"
                        >
                            <option value="">Ne pas modifier</option>
                            <option value="OPEN">Ouvert</option>
                            <option value="CLOSED">Fermé</option>
                            <option value="TEMPORARILY_CLOSED">Fermeture temporaire</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-3">
                        {DAYS.map((d) => {
                            const current = groupedHours.get(d.day) ?? { day: d.day, open: '09:00', close: '22:00' };
                            return (
                                <div key={d.day} className="grid grid-cols-[110px_1fr_1fr] gap-2 items-center">
                                    <span className="text-sm text-stone-600 font-semibold">{d.label}</span>
                                    <input
                                        type="time"
                                        value={current.open}
                                        onChange={(e) => setDayHours(d.day, { open: e.target.value })}
                                        className="px-3 py-2 rounded-xl border border-stone-200 text-sm outline-none focus:border-accent"
                                    />
                                    <input
                                        type="time"
                                        value={current.close}
                                        onChange={(e) => setDayHours(d.day, { close: e.target.value })}
                                        className="px-3 py-2 rounded-xl border border-stone-200 text-sm outline-none focus:border-accent"
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {settingsMsg && <p className="text-sm text-stone-500">{settingsMsg}</p>}
                    <button
                        onClick={handleSaveSettings}
                        disabled={savingSettings}
                        className="cursor-pointer py-3 rounded-xl text-sm font-bold text-white transition-all hover:shadow-md disabled:opacity-70"
                        style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                    >
                        {savingSettings ? 'Enregistrement…' : 'Enregistrer les paramètres'}
                    </button>
                </section>

                <section className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-stone-900">Créer une offre</h2>

                    <form onSubmit={handleAddOffer} className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-stone-700">Libellé</label>
                            <input
                                value={offerLabel}
                                onChange={(e) => setOfferLabel(e.target.value)}
                                placeholder="-20% sur les plats du midi"
                                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-accent"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-stone-700">Réduction (%)</label>
                            <input
                                type="number"
                                min={1}
                                max={100}
                                value={offerDiscount}
                                onChange={(e) => setOfferDiscount(parseInt(e.target.value) || 1)}
                                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-accent"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-stone-700">Image (optionnel)</label>
                            <input
                                value={offerImageUrl}
                                onChange={(e) => setOfferImageUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-accent"
                            />
                        </div>

                        {offerMsg && <p className="text-sm text-stone-500">{offerMsg}</p>}
                        <button
                            type="submit"
                            disabled={savingOffer}
                            className="cursor-pointer py-3 rounded-xl text-sm font-bold text-white transition-all hover:shadow-md disabled:opacity-70"
                            style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                        >
                            {savingOffer ? 'Création…' : 'Créer l\'offre'}
                        </button>
                    </form>

                    <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
                        <p className="text-sm font-semibold text-stone-700">Offres actives ({offers.length})</p>
                        {offers.length === 0 && (
                            <p className="text-sm text-stone-400">Aucune offre active pour le moment.</p>
                        )}
                        {offers.map((offer) => (
                            <div key={offer.id} className="flex items-center justify-between rounded-xl bg-stone-50 px-3 py-2.5">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-stone-800 truncate">{offer.label}</p>
                                    <p className="text-xs text-stone-400">{offer.discountPercent}%</p>
                                </div>
                                <span className="text-xs font-bold text-accent shrink-0">-{offer.discountPercent}%</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="text-xs text-stone-400">
                Restaurant: {restaurant?.name ?? 'Mon restaurant'}
            </div>
        </div>
    );
}
