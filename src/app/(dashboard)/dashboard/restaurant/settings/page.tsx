"use client";

import { useState, useEffect } from "react";
import { useRestaurant } from "@/context/RestaurantContext";
import { CheckIcon } from "@/components/icons";

const DAYS = [
    { dayOfWeek: 1, label: "Lundi" },
    { dayOfWeek: 2, label: "Mardi" },
    { dayOfWeek: 3, label: "Mercredi" },
    { dayOfWeek: 4, label: "Jeudi" },
    { dayOfWeek: 5, label: "Vendredi" },
    { dayOfWeek: 6, label: "Samedi" },
    { dayOfWeek: 0, label: "Dimanche" },
];

type DayState = { open: boolean; openTime: string; closeTime: string };

function buildDayStates(openingHours?: { dayOfWeek: number; openTime: string; closeTime: string }[]): Record<number, DayState> {
    const defaults: Record<number, DayState> = {};
    for (const { dayOfWeek } of DAYS) {
        defaults[dayOfWeek] = { open: false, openTime: "11:00", closeTime: "22:00" };
    }
    for (const h of openingHours ?? []) {
        defaults[h.dayOfWeek] = { open: true, openTime: h.openTime, closeTime: h.closeTime };
    }
    return defaults;
}

const STATUS_OPTIONS: { value: "OPEN" | "CLOSED" | "TEMPORARILY_CLOSED"; label: string; color: string }[] = [
    { value: "OPEN", label: "Ouvert", color: "green" },
    { value: "TEMPORARILY_CLOSED", label: "Temporairement fermé", color: "orange" },
    { value: "CLOSED", label: "Fermé", color: "red" },
];

export default function RestaurantSettingsPage() {
    const { restaurant, updateRestaurant } = useRestaurant();

    const [days, setDays] = useState<Record<number, DayState>>(() => buildDayStates(restaurant?.openingHours));
    const [status, setStatus] = useState<"OPEN" | "CLOSED" | "TEMPORARILY_CLOSED">(
        (restaurant?.status as "OPEN" | "CLOSED" | "TEMPORARILY_CLOSED") ?? "OPEN"
    );
    const [description, setDescription] = useState(restaurant?.description ?? "");
    const [cuisineType, setCuisineType] = useState(restaurant?.cuisineType ?? "");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!restaurant) return;
        setDays(buildDayStates(restaurant.openingHours));
        setStatus((restaurant.status as "OPEN" | "CLOSED" | "TEMPORARILY_CLOSED") ?? "OPEN");
        setDescription(restaurant.description ?? "");
        setCuisineType(restaurant.cuisineType ?? "");
    }, [restaurant]);

    const setDay = (dayOfWeek: number, patch: Partial<DayState>) =>
        setDays((prev) => ({ ...prev, [dayOfWeek]: { ...prev[dayOfWeek]!, ...patch } }));

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        setError("");
        try {
            const openingHours = DAYS
                .filter(({ dayOfWeek }) => days[dayOfWeek]?.open)
                .map(({ dayOfWeek }) => ({
                    dayOfWeek,
                    openTime: days[dayOfWeek]!.openTime,
                    closeTime: days[dayOfWeek]!.closeTime,
                }));
            await updateRestaurant({ openingHours, status, description, cuisineType });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch {
            setError("Une erreur est survenue. Réessayez.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-2xl">
            <h1 className="text-2xl font-bold text-stone-900">Paramètres du restaurant</h1>

            <section className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex flex-col gap-4">
                <h2 className="font-bold text-stone-900">Statut d'ouverture</h2>
                <div className="flex gap-3 flex-wrap">
                    {STATUS_OPTIONS.map(({ value, label, color }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setStatus(value)}
                            className={`cursor-pointer px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                                status === value
                                    ? color === "green"
                                        ? "border-green-500 bg-green-50 text-green-700"
                                        : color === "orange"
                                        ? "border-orange-400 bg-orange-50 text-orange-700"
                                        : "border-red-400 bg-red-50 text-red-700"
                                    : "border-stone-200 text-stone-500 hover:border-stone-300"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </section>

            <section className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex flex-col gap-4">
                <h2 className="font-bold text-stone-900">Horaires d'ouverture</h2>
                <div className="flex flex-col gap-3">
                    {DAYS.map(({ dayOfWeek, label }) => {
                        const day = days[dayOfWeek]!;
                        return (
                            <div key={dayOfWeek} className="flex items-center gap-4">
                                <div className="w-28 shrink-0 flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setDay(dayOfWeek, { open: !day.open })}
                                        className={`cursor-pointer w-9 h-5 rounded-full transition-colors relative ${day.open ? "bg-accent" : "bg-stone-200"}`}
                                    >
                                        <span
                                            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${day.open ? "translate-x-0" : "-translate-x-4"}`}
                                        />
                                    </button>
                                    <span className={`text-sm font-semibold ${day.open ? "text-stone-900" : "text-stone-400"}`}>
                                        {label}
                                    </span>
                                </div>
                                {day.open ? (
                                    <div className="flex items-center gap-2 flex-1">
                                        <input
                                            type="time"
                                            value={day.openTime}
                                            onChange={(e) => setDay(dayOfWeek, { openTime: e.target.value })}
                                            className="px-3 py-1.5 rounded-lg border border-stone-200 text-sm focus:border-accent outline-none"
                                        />
                                        <span className="text-stone-400 text-sm">→</span>
                                        <input
                                            type="time"
                                            value={day.closeTime}
                                            onChange={(e) => setDay(dayOfWeek, { closeTime: e.target.value })}
                                            className="px-3 py-1.5 rounded-lg border border-stone-200 text-sm focus:border-accent outline-none"
                                        />
                                    </div>
                                ) : (
                                    <span className="text-sm text-stone-300 italic">Fermé</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex flex-col gap-4">
                <h2 className="font-bold text-stone-900">Informations générales</h2>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-stone-700">Type de cuisine</label>
                        <input
                            type="text"
                            value={cuisineType}
                            onChange={(e) => setCuisineType(e.target.value)}
                            placeholder="Italienne, Burgers, Asiatique…"
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-accent outline-none text-sm"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-stone-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Décrivez votre restaurant…"
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-accent outline-none text-sm resize-none"
                        />
                    </div>
                </div>
            </section>

            {error && (
                <p className="text-sm text-red-500 font-semibold">{error}</p>
            )}

            <button
                onClick={handleSave}
                disabled={saving}
                className="cursor-pointer self-start flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:shadow-md disabled:opacity-60"
                style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
            >
                {saved ? <><CheckIcon size={16} /> Enregistré</> : saving ? "Enregistrement…" : "Enregistrer les modifications"}
            </button>
        </div>
    );
}
