"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { DeliveryAddressProvider } from "@/context/DeliveryAddressContext";
import { useAuth } from "@/context/AuthContext";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoading, isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    const roles = user?.roles ?? [];
    if (roles.includes("RESTAURATEUR")) { router.push("/dashboard/restaurant"); return; }
    if (roles.includes("COURIER")) { router.push("/dashboard/courier"); }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <DeliveryAddressProvider>
      <OrderProvider>
        <CartProvider>
          <Navigation />
          {children}
          <Footer />
        </CartProvider>
      </OrderProvider>
    </DeliveryAddressProvider>
  );
}

