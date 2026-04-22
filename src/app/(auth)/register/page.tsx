"use client";

import { useState } from "react";
import { apiRequest } from "@/services/api";
import { RegisterResponse } from "@/types/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserIcon, ScooterIcon, BagIcon, CheckIcon } from "@/components/icons";

type Role = "client" | "courier" | "restaurant_owner";

const ROLES: { value: Role; label: string; description: string; Icon: React.ComponentType<any> }[] = [
    {
        value: "client",
        label: "Client",
        description: "Je commande des repas",
        Icon: UserIcon,
    },
    {
        value: "courier",
        label: "Livreur",
        description: "Je livre des commandes",
        Icon: ScooterIcon,
    },
    {
        value: "restaurant_owner",
        label: "Restaurateur",
        description: "Je gère un restaurant",
        Icon: BagIcon,
    },
];

const ENDPOINT: Record<Role, string> = {
    client: "/auth/register/client",
    courier: "/auth/register/courier",
    restaurant_owner: "/auth/register/restaurant",
};

export default function RegisterPage() {
    const router = useRouter();
    const [role, setRole] = useState<Role>("client");
    const [personal, setPersonal] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "" });
    const [restaurant, setRestaurant] = useState({ restaurantName: "", restaurantAddress: "", restaurantCity: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const setPer = (k: keyof typeof personal) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setPersonal((p) => ({ ...p, [k]: e.target.value }));
    const setRest = (k: keyof typeof restaurant) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setRestaurant((p) => ({ ...p, [k]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const payload =
                role === "restaurant_owner"
                    ? { ...personal, ...restaurant }
                    : { ...personal };

            await apiRequest<RegisterResponse>(ENDPOINT[role], "POST", payload);

            setSuccess("Inscription réussie ! Redirection vers la connexion…");
            setTimeout(() => router.push("/login"), 2000);
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue lors de l'inscription.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-12">
            <div className="w-full max-w-lg">
                <div className="mb-8 text-center">
                    <Link href="/">
                        <h1 className="text-4xl font-bold text-accent mb-2">EcoEats</h1>
                    </Link>
                    <p className="text-stone-500">Créez votre compte</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
                    <h2 className="text-xl font-bold text-stone-900 mb-6 text-center">Inscription</h2>

                    {error && (
                        <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-5 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm flex items-center gap-2">
                            <CheckIcon size={16} />
                            {success}
                        </div>
                    )}

                    {/* Role selector */}
                    <div className="mb-6">
                        <p className="text-sm font-semibold text-stone-700 mb-3">Je suis un…</p>
                        <div className="grid grid-cols-3 gap-3">
                            {ROLES.map(({ value, label, description, Icon }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setRole(value)}
                                    className={`cursor-pointer flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-center ${
                                        role === value
                                            ? "border-accent bg-accent/5"
                                            : "border-stone-200 hover:border-stone-300 bg-white"
                                    }`}
                                >
                                    <Icon
                                        size={24}
                                        className={role === value ? "text-accent" : "text-stone-400"}
                                    />
                                    <span className={`text-xs font-bold ${role === value ? "text-accent" : "text-stone-600"}`}>
                                        {label}
                                    </span>
                                    <span className="text-[10px] text-stone-400 leading-tight">{description}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Personal info */}
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Prénom">
                                <input
                                    value={personal.firstName}
                                    onChange={setPer("firstName")}
                                    required
                                    placeholder="Jean"
                                    className={inputCls}
                                />
                            </Field>
                            <Field label="Nom">
                                <input
                                    value={personal.lastName}
                                    onChange={setPer("lastName")}
                                    required
                                    placeholder="Dupont"
                                    className={inputCls}
                                />
                            </Field>
                        </div>

                        <Field label="Email">
                            <input
                                type="email"
                                value={personal.email}
                                onChange={setPer("email")}
                                required
                                placeholder="votre@email.com"
                                className={inputCls}
                            />
                        </Field>

                        <Field label="Téléphone">
                            <input
                                type="tel"
                                value={personal.phone}
                                onChange={setPer("phone")}
                                placeholder="06 00 00 00 00"
                                className={inputCls}
                            />
                        </Field>

                        <Field label="Mot de passe">
                            <input
                                type="password"
                                value={personal.password}
                                onChange={setPer("password")}
                                required
                                placeholder="••••••••"
                                className={inputCls}
                            />
                        </Field>

                        {/* Restaurant-specific fields */}
                        {role === "restaurant_owner" && (
                            <div className="flex flex-col gap-4 pt-2 border-t border-stone-100">
                                <p className="text-sm font-bold text-stone-700">Informations du restaurant</p>

                                <Field label="Nom du restaurant">
                                    <input
                                        value={restaurant.restaurantName}
                                        onChange={setRest("restaurantName")}
                                        required
                                        placeholder="Chez Mario"
                                        className={inputCls}
                                    />
                                </Field>

                                <Field label="Adresse">
                                    <input
                                        value={restaurant.restaurantAddress}
                                        onChange={setRest("restaurantAddress")}
                                        required
                                        placeholder="12 rue de la Paix"
                                        className={inputCls}
                                    />
                                </Field>

                                <Field label="Ville">
                                    <input
                                        value={restaurant.restaurantCity}
                                        onChange={setRest("restaurantCity")}
                                        required
                                        placeholder="Paris"
                                        className={inputCls}
                                    />
                                </Field>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:shadow-lg hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 mt-2"
                            style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                        >
                            {loading ? "Inscription en cours…" : "Créer mon compte"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-stone-500">
                        Déjà un compte ?{" "}
                        <Link href="/login" className="text-accent font-semibold hover:underline">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-stone-700">{label}</label>
            {children}
        </div>
    );
}

const inputCls =
    "w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:border-accent outline-none transition text-sm bg-white";
