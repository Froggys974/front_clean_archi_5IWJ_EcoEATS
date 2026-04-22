"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { UserIcon } from "@/components/icons";

const ROLE_LABELS: Record<string, string> = {
    client: "Client",
    courier: "Livreur",
    restaurateur: "Restaurateur",
    restaurant_owner: "Restaurateur",
    admin: "Administrateur",
};

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent" />
            </div>
        );
    }

    const roles = user.roles ?? [];
    const displayName = user.firstName
        ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
        : "Mon compte";

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
            <div className="max-w-2xl mx-auto flex flex-col gap-6">
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                    <div
                        className="h-24 w-full"
                        style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)" }}
                    />
                    <div className="px-6 pb-6 -mt-10">
                        <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-accent mb-4">
                            <UserIcon size={36} />
                        </div>
                        <h1 className="text-2xl font-bold text-stone-900">{displayName}</h1>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {roles.map((role) => (
                                <span
                                    key={role}
                                    className="text-xs font-semibold px-3 py-1 rounded-full bg-accent/10 text-accent"
                                >
                                    {ROLE_LABELS[role] ?? role}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex flex-col gap-4">
                    <h2 className="text-base font-bold text-stone-900">Informations du compte</h2>
                    {user.email && <InfoRow label="Email" value={user.email} />}
                    <InfoRow
                        label="Rôle(s)"
                        value={roles.map((r) => ROLE_LABELS[r] ?? r).join(", ") || "—"}
                    />
                </div>
                <Link
                    href="/profile/orders"
                    className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 flex items-center justify-between hover:border-accent transition-colors group"
                >
                    <div>
                        <h2 className="text-base font-bold text-stone-900">Mes commandes</h2>
                        <p className="text-sm text-stone-400 mt-0.5">Voir l'historique de vos commandes</p>
                    </div>
                    <span className="text-stone-300 group-hover:text-accent transition-colors text-xl">→</span>
                </Link>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href="/"
                        className="flex-1 text-center py-3 rounded-xl border border-stone-200 text-stone-600 text-sm font-semibold hover:border-accent hover:text-accent transition-colors"
                    >
                        Retour à l'accueil
                    </Link>
                    <button
                        onClick={() => { logout(); router.push("/"); }}
                        className="cursor-pointer flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:scale-[1.01] active:scale-95"
                        style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                    >
                        Se déconnecter
                    </button>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
    return (
        <div className="flex items-start justify-between gap-4 py-2 border-b border-stone-50 last:border-0">
            <span className="text-sm text-stone-400 shrink-0">{label}</span>
            <span className={`text-sm text-stone-700 text-right break-all ${mono ? "font-mono text-xs" : "font-medium"}`}>
                {value}
            </span>
        </div>
    );
}
