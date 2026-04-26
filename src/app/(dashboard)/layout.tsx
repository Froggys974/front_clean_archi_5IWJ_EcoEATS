"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { RestaurantProvider } from "@/context/RestaurantContext";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { MenuIcon } from "@/components/icons";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) router.push("/login");
    }, [isLoading, isAuthenticated, router]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-stone-50">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent" />
            </div>
        );
    }

    const role = user?.roles?.[0];

    return (
        <RestaurantProvider userId={user?.id}>
            <div className="flex min-h-screen bg-stone-50">
                {/* Sidebar backdrop (mobile) */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-stone-100 shadow-sm flex flex-col transition-transform duration-300 lg:translate-x-0 ${
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:static lg:flex`}
                >
                    <DashboardNav role={role} onNavigate={() => setSidebarOpen(false)} />
                </aside>

                {/* Main content */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Mobile top bar */}
                    <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-stone-100 sticky top-0 z-20">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="cursor-pointer p-1.5 text-stone-600 hover:text-accent transition-colors"
                            aria-label="Ouvrir le menu"
                        >
                            <MenuIcon size={22} />
                        </button>
                        <span className="font-bold text-accent text-lg">EcoEats</span>
                    </div>

                    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </RestaurantProvider>
    );
}
