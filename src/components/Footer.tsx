"use client";

import Link from "next/link";
import { useState } from "react";

const cities = [
    "Paris", "Lyon", "Marseille", "Bordeaux",
    "Toulouse", "Nice", "Nantes", "Strasbourg",
    "Montpellier", "Rennes", "Lille", "Grenoble",
];

const siteLinks = [
    { label: "À propos", href: "/" },
    { label: "Comment ça marche", href: "/" },
    { label: "Restaurants", href: "/" },
    { label: "Carrières", href: "/" },
    { label: "Blog", href: "/" },
    { label: "Contact", href: "/" },
    { label: "CGU", href: "/" },
    { label: "Confidentialité", href: "/" },
];

export default function Footer() {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        setEmail("");
    };

    return (
        <footer className="w-full bg-stone-900 text-stone-300">
            <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

                {/* Brand + cities */}
                <div className="flex flex-col gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-accent mb-2">EcoEats</h2>
                        <p className="text-stone-400 text-sm leading-relaxed">
                            La livraison de repas éco-responsable,<br />partout en France.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Villes desservies</h3>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                            {cities.map((city) => (
                                <li key={city}>
                                    <Link
                                        href="/"
                                        className="text-stone-400 hover:text-accent text-sm transition-colors duration-200"
                                    >
                                        {city}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Site links */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Le site</h3>
                    <ul className="flex flex-col gap-2.5">
                        {siteLinks.map((link) => (
                            <li key={link.label}>
                                <Link
                                    href={link.href}
                                    className="text-stone-400 hover:text-accent text-sm transition-colors duration-200"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Newsletter */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Newsletter</h3>
                    <p className="text-stone-400 text-sm leading-relaxed">
                        Recevez nos meilleures offres et nouveautés directement dans votre boîte mail.
                    </p>
                    <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votre@email.fr"
                            required
                            className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-accent transition-colors"
                        />
                        <button
                            type="submit"
                            className="cursor-pointer w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-95"
                            style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                        >
                            S'abonner
                        </button>
                    </form>
                </div>
            </div>

            {/* Copyright bar */}
            <div className="border-t border-stone-800">
                <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-stone-500 text-xs">
                    <span>© {new Date().getFullYear()} EcoEats. Tous droits réservés.</span>
                    <span>Fait avec ❤️ pour une livraison éco-responsable (et L'ESGI).</span>
                </div>
            </div>
        </footer>
    );
}
