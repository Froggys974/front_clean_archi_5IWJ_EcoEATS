"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserIcon, MapPinIcon, MenuIcon, XIcon } from "@/components/icons";
import { useAuth } from "@/context/AuthContext";

export default function Navigation() {
    const { isAuthenticated, user, logout } = useAuth();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    const displayName = user?.firstName
        ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
        : "Mon compte";

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        router.push("/");
    };

    return (
        <>
            <nav className="fixed inset-x-0 top-0 z-50 w-full bg-white border-b border-stone-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">

                    {/* Logo */}
                    <Link href="/" className="shrink-0">
                        <span className="text-2xl sm:text-3xl font-bold text-accent">EcoEats</span>
                    </Link>

                    {/* Center: address — hidden on mobile */}
                    <div className="hidden md:flex items-center gap-1.5 text-stone-500 text-sm min-w-0 flex-1 justify-center">
                        <MapPinIcon size={16} className="shrink-0 text-accent" />
                        <span className="truncate max-w-[220px] lg:max-w-xs">4 rue du Bourg, Paris</span>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">

                        {/* Desktop nav */}
                        <Link
                            href="/restaurants"
                            className="hidden sm:block text-sm font-semibold text-stone-600 hover:text-accent transition-colors px-3 py-2 rounded-lg hover:bg-stone-50"
                        >
                            Restaurants
                        </Link>

                        {isAuthenticated ? (
                            <div className="hidden sm:flex items-center gap-2">
                                {user?.roles?.includes("restaurateur") && (
                                    <Link
                                        href="/dashboard/restaurant"
                                        className="text-sm font-bold px-4 py-2 rounded-lg text-white transition-all hover:shadow-md hover:scale-[1.02]"
                                        style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                                    >
                                        Mon dashboard
                                    </Link>
                                )}
                                {user?.roles?.includes("courier") && (
                                    <Link
                                        href="/dashboard/courier"
                                        className="text-sm font-bold px-4 py-2 rounded-lg text-white transition-all hover:shadow-md hover:scale-[1.02]"
                                        style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                                    >
                                        Mon dashboard
                                    </Link>
                                )}
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-accent transition-colors px-3 py-2 rounded-lg hover:bg-stone-50"
                                >
                                    <UserIcon size={18} />
                                    <span>{displayName}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="cursor-pointer border border-stone-200 text-stone-500 text-sm font-medium px-3 py-2 rounded-lg hover:border-accent hover:text-accent transition-colors"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden sm:flex items-center gap-2 border border-accent text-accent text-sm font-bold px-4 py-2 rounded-lg hover:bg-accent hover:text-white transition-all duration-200"
                            >
                                <UserIcon size={18} />
                                <span>Se connecter</span>
                            </Link>
                        )}

                        {/* Mobile: profile icon + burger */}
                        <div className="flex sm:hidden items-center gap-1">
                            {isAuthenticated && (
                                <Link
                                    href="/profile"
                                    className="p-2 text-stone-600 hover:text-accent transition-colors rounded-lg"
                                >
                                    <UserIcon size={20} />
                                </Link>
                            )}
                            <button
                                onClick={() => setMenuOpen(true)}
                                className="cursor-pointer p-2 text-stone-600 hover:text-accent transition-colors rounded-lg"
                                aria-label="Ouvrir le menu"
                            >
                                <MenuIcon size={22} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile menu overlay */}
            {menuOpen && (
                <div className="sm:hidden fixed inset-0 z-[60] flex">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setMenuOpen(false)}
                    />
                    <div className="relative ml-auto w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col">

                        {/* Panel header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
                            <span className="text-xl font-bold text-accent">EcoEats</span>
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="cursor-pointer p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
                                aria-label="Fermer le menu"
                            >
                                <XIcon size={20} />
                            </button>
                        </div>

                        {/* Address */}
                        <div className="flex items-center gap-2 px-5 py-3 bg-stone-50 border-b border-stone-100">
                            <MapPinIcon size={15} className="text-accent shrink-0" />
                            <span className="text-sm text-stone-600">4 rue du Bourg, Paris</span>
                        </div>

                        {/* User info if authenticated */}
                        {isAuthenticated && (
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-100">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-accent/10 text-accent">
                                    <UserIcon size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-stone-900 truncate">{displayName}</p>
                                    {user?.email && (
                                        <p className="text-xs text-stone-400 truncate">{user.email}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Links */}
                        <div className="flex flex-col px-4 py-3 gap-1 flex-1 overflow-y-auto">
                            <NavLink href="/restaurants" onClick={() => setMenuOpen(false)}>
                                Restaurants
                            </NavLink>
                            {isAuthenticated && (
                                <>
                                    {user?.roles?.includes("restaurateur") && (
                                        <NavLink href="/dashboard/restaurant" onClick={() => setMenuOpen(false)}>
                                            Mon dashboard
                                        </NavLink>
                                    )}
                                    {user?.roles?.includes("courier") && (
                                        <NavLink href="/dashboard/courier" onClick={() => setMenuOpen(false)}>
                                            Mon dashboard
                                        </NavLink>
                                    )}
                                    <NavLink href="/profile" onClick={() => setMenuOpen(false)}>
                                        Mon profil
                                    </NavLink>
                                    <NavLink href="/profile/orders" onClick={() => setMenuOpen(false)}>
                                        Mes commandes
                                    </NavLink>
                                </>
                            )}
                        </div>

                        {/* Auth CTA */}
                        <div className="px-4 pb-8 pt-4 border-t border-stone-100">
                            {isAuthenticated ? (
                                <button
                                    onClick={handleLogout}
                                    className="cursor-pointer w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:shadow-md active:scale-95"
                                    style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                                >
                                    Se déconnecter
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="block w-full py-3 rounded-xl text-sm font-bold text-white text-center transition-all hover:shadow-md active:scale-95"
                                    style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                                >
                                    Se connecter
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function NavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="text-sm font-semibold text-stone-700 hover:text-accent px-4 py-3 rounded-xl hover:bg-stone-50 transition-colors"
        >
            {children}
        </Link>
    );
}
