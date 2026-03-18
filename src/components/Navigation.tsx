"use client";

import Link from "next/link";
import { UserIcon } from "@/components/icons";
import { useAuth } from "@/context/AuthContext";

const adressName = "Mon adresse"
const location = "4 rue du Bourg, Paris"

export default function Navigation() {
    const { isAuthenticated, user, logout } = useAuth();

    if(isAuthenticated) console.log("User is authenticated:", user);

    return (
        <nav className="fixed mx-auto inset-x-0 top-0 z-50 w-full bg-white px-6 py-4 backdrop-blur-md backdrop-saturate-150 sm:px-12 max-h-18">
            <div className="max-w-7xl grid grid-cols-[1fr_auto_1fr] items-center mx-auto" >
                <div className="justify-self-start">
                    <Link href="/">
                        <h1 className="text-4xl font-bold text-accent mb-2">EcoEats</h1>
                    </Link>
                </div>
                <div className="flex items-center justify-center gap-4 justify-self-center">
                    <p>Livrer à : <span>{adressName} - {location}</span></p>
                </div>
                <div className="flex items-center gap-4 justify-self-end">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-gray-700">
                                <UserIcon size={24} />
                                <span className="font-semibold">{user?.firstName || (user?.roles && user.roles.length > 0 ? user.roles[0] : 'Utilisateur')}</span>
                            </div>
                            <button 
                                onClick={logout}
                                className="cursor-pointer border border-accent text-accent px-4 py-2 rounded-lg hover:bg-accent hover:text-white transition-all duration-200"
                            >
                                Déconnexion
                            </button>
                        </div>
                    ) : (
                        <div className="group cursor-pointer border border-accent text-accent px-4 py-2 rounded-lg hover:text-black hover:bg-accent transition-all duration-200">
                            <Link href="/login" className="flex items-center gap-2">
                                <UserIcon size={24} />
                                <span className="font-bold">Se connecter</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}