"use client";

import { useState } from "react";

const ALL_ALLERGENS = [
    "Gluten", "Crustacés", "Œufs", "Poisson", "Arachides",
    "Soja", "Lait", "Fruits à coque", "Céleri", "Moutarde",
    "Sésame", "Mollusques", "Lupin", "Sulfites",
];

export type DishFormData = {
    name: string;
    description: string;
    price: number;
    allergens: string[];
    dailyStock: number;
    categoryId: string;
    image: string;
};

const DEFAULT_DISH_IMAGE = "https://picsum.photos/200/150?random=237";

interface DishFormProps {
    initial?: Partial<DishFormData>;
    onSubmit: (data: DishFormData) => void;
    onCancel: () => void;
    submitLabel?: string;
    isLoading?: boolean;
}

export default function DishForm({ initial, onSubmit, onCancel, submitLabel = "Enregistrer", isLoading }: DishFormProps) {
    const [form, setForm] = useState<DishFormData>({
        name: initial?.name ?? "",
        description: initial?.description ?? "",
        price: initial?.price ?? 0,
        allergens: initial?.allergens ?? [],
        dailyStock: initial?.dailyStock ?? 10,
        categoryId: initial?.categoryId ?? 'cat-1',
        image: initial?.image ?? DEFAULT_DISH_IMAGE,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const set = <K extends keyof DishFormData>(key: K, value: DishFormData[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const toggleAllergen = (allergen: string) =>
        set("allergens", form.allergens.includes(allergen)
            ? form.allergens.filter((a) => a !== allergen)
            : [...form.allergens, allergen]);

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = "Nom requis";
        if (form.price <= 0) e.price = "Prix invalide";
        if (form.dailyStock < 0) e.dailyStock = "Stock invalide";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Nom du plat" error={errors.name}>
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Pizza Margherita"
                    className={inputCls(!!errors.name)}
                />
            </Field>

            <Field label="Description" error="">
                <textarea
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Description du plat…"
                    rows={3}
                    className={`${inputCls(false)} resize-none`}
                />
            </Field>

            <div className="grid grid-cols-2 gap-4">
                <Field label="Prix (€)" error={errors.price}>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.price}
                        onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
                        className={inputCls(!!errors.price)}
                    />
                </Field>
                <Field label="Stock journalier" error={errors.dailyStock}>
                    <input
                        type="number"
                        min="0"
                        value={form.dailyStock}
                        onChange={(e) => set("dailyStock", parseInt(e.target.value) || 0)}
                        className={inputCls(!!errors.dailyStock)}
                    />
                </Field>
            </div>

            <Field label="Allergènes" error="">
                <div className="flex flex-wrap gap-2 mt-1">
                    {ALL_ALLERGENS.map((a) => (
                        <button
                            key={a}
                            type="button"
                            onClick={() => toggleAllergen(a)}
                            className={`cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                                form.allergens.includes(a)
                                    ? "bg-accent text-white border-accent"
                                    : "bg-white text-stone-600 border-stone-200 hover:border-accent hover:text-accent"
                            }`}
                        >
                            {a}
                        </button>
                    ))}
                </div>
            </Field>

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="cursor-pointer flex-1 py-3 rounded-xl border border-stone-200 text-stone-600 text-sm font-semibold hover:border-accent hover:text-accent transition-colors"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="cursor-pointer flex-[2] py-3 rounded-xl text-sm font-bold text-white transition-all hover:shadow-md disabled:opacity-70"
                    style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                >
                    {isLoading ? "Enregistrement…" : submitLabel}
                </button>
            </div>
        </form>
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

function inputCls(err: boolean) {
    return `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
        err ? "border-red-300 bg-red-50" : "border-stone-200 focus:border-accent bg-white"
    }`;
}
