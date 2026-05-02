"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRestaurant } from "@/context/RestaurantContext";
import { BagIcon, UserIcon, ScooterIcon, CartIcon, TruckIcon, WalletIcon } from "@/components/icons";

interface DashboardNavProps {
    role?: string;
    onNavigate?: () => void;
}

const RESTAURANT_LINKS = [
    { href: "/dashboard/restaurant", label: "Vue d'ensemble", Icon: BagIcon, exact: true },
    { href: "/dashboard/restaurant/menu", label: "Menu & plats", Icon: CartIcon, exact: false },
    { href: "/dashboard/restaurant/orders", label: "Commandes", Icon: BagIcon, exact: false },
    { href: "/dashboard/restaurant/settings", label: "Paramètres", Icon: UserIcon, exact: false },
];

const COURIER_LINKS = [
    { href: "/dashboard/courier", label: "Tableau de bord", Icon: ScooterIcon, exact: true },
    { href: "/dashboard/courier/deliveries", label: "Livraisons", Icon: TruckIcon, exact: false },
    { href: "/dashboard/courier/wallet", label: "Portefeuille", Icon: WalletIcon, exact: false },
];

export default function DashboardNav({ role, onNavigate }: DashboardNavProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { restaurant } = useRestaurant();
    const router = useRouter();

    const links = role === "courier" ? COURIER_LINKS : RESTAURANT_LINKS;

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const isActive = (href: string, exact: boolean) =>
        exact ? pathname === href : pathname.startsWith(href);

    return (
        <div className="flex flex-col h-full">
            <div className="px-5 py-5 border-b border-stone-100">
                <Link href="/" className="text-2xl font-bold text-accent block mb-3">
                    EcoEats
                </Link>
                <div className="bg-stone-50 rounded-xl p-3">
                    <p className="text-xs text-stone-400 font-medium mb-0.5">
                        {role === "courier" ? "Livreur" : "Restaurateur"}
                    </p>
                    <p className="text-sm font-bold text-stone-900 truncate">
                        {role === "courier"
                            ? (user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : "Mon compte")
                            : (restaurant?.name ?? "Mon restaurant")}
                    </p>
                    {role !== "courier" && restaurant?.city && (
                        <p className="text-xs text-stone-400 truncate mt-0.5">{restaurant.address}, {restaurant.city}</p>
                    )}
                </div>
            </div>
            <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
                {links.map(({ href, label, Icon, exact }) => (
                    <Link
                        key={href}
                        href={href}
                        onClick={onNavigate}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                            isActive(href, exact)
                                ? "text-white shadow-sm"
                                : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                        }`}
                        style={isActive(href, exact)
                            ? { background: "linear-gradient(to right, var(--primary), var(--accent))" }
                            : undefined}
                    >
                        <Icon size={18} />
                        {label}
                    </Link>
                ))}
            </nav>
            <div className="px-3 py-4 border-t border-stone-100 flex flex-col gap-2">
                <Link
                    href="/profile"
                    onClick={onNavigate}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-all"
                >
                    <UserIcon size={16} />
                    Mon profil
                </Link>
                <button
                    onClick={handleLogout}
                    className="cursor-pointer flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all text-left w-full"
                >
                    Se déconnecter
                </button>
            </div>
        </div>
    );
}
