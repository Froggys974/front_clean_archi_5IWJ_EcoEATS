import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "EcoEats - Authentification",
  description: "Authentification EcoEats",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <>
        {children}
      </>
  );
}

