"use client";

import { useEffect } from "react";
import { XIcon } from "@/components/icons";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
}

export default function Modal({ open, onClose, title, children, maxWidth = "max-w-md" }: ModalProps) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${maxWidth} flex flex-col max-h-[90vh] overflow-hidden`}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                    <h2 className="text-base font-bold text-stone-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="cursor-pointer p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
                        aria-label="Fermer"
                    >
                        <XIcon size={18} />
                    </button>
                </div>
                <div className="overflow-y-auto flex-1 px-6 py-5">
                    {children}
                </div>
            </div>
        </div>
    );
}
