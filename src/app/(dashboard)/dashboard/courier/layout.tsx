"use client";

import { CourierProvider } from "@/context/CourierContext";

export default function CourierLayout({ children }: { children: React.ReactNode }) {
    return <CourierProvider>{children}</CourierProvider>;
}
