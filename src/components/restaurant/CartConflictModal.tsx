"use client";

interface CartConflictModalProps {
    currentRestaurantName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function CartConflictModal({
    currentRestaurantName,
    onConfirm,
    onCancel,
}: CartConflictModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-bold text-stone-900">Nouveau restaurant</h2>
                    <p className="text-stone-500 text-sm leading-relaxed">
                        Votre panier contient déjà des articles de{" "}
                        <span className="font-semibold text-stone-700">{currentRestaurantName}</span>.
                        Souhaitez-vous vider votre panier et commander depuis ce restaurant ?
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="cursor-pointer flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-sm font-semibold hover:bg-stone-50 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="cursor-pointer flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                        style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                    >
                        Vider et commander
                    </button>
                </div>
            </div>
        </div>
    );
}
