"use client";

export type ApiInvoice = {
    invoiceNumber: string;
    clientName: string;
    restaurantName: string;
    lineItems: { id: string; dishName: string; quantity: number; unitPrice: number; totalPrice: number }[];
    itemsSubtotal: number;
    deliveryFee: number;
    serviceFee: number;
    tipAmount: number;
    totalAmount: number;
    paymentMethod: string | null;
    isPaid: boolean;
    paidAt: string | null;
    createdAt: string;
};

function downloadInvoicePdf(inv: ApiInvoice) {
    const win = window.open("", "_blank");
    if (!win) return;
    const date = new Date(inv.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    const rows = inv.lineItems.map(item =>
        `<tr><td>${item.quantity}× ${item.dishName}</td><td style="text-align:right">${item.totalPrice.toFixed(2)} €</td></tr>`
    ).join("");
    const tip = inv.tipAmount > 0
        ? `<tr><td style="color:#16a34a">Pourboire livreur <span style="font-size:11px">(100% reversé)</span></td><td style="text-align:right;color:#16a34a">${inv.tipAmount.toFixed(2)} €</td></tr>`
        : "";
    win.document.write(`<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>${inv.invoiceNumber}</title><style>
        body{font-family:Georgia,serif;max-width:600px;margin:40px auto;color:#1c1917;font-size:14px}
        h1{font-size:22px;margin:0}p{margin:4px 0}
        table{width:100%;border-collapse:collapse;margin:16px 0}
        td{padding:6px 4px;border-bottom:1px solid #e7e5e4}
        .total td{font-weight:bold;font-size:16px;border-top:2px solid #1c1917;border-bottom:none}
        .label{color:#78716c;font-size:12px;text-transform:uppercase;letter-spacing:.05em}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:16px 0}
        @media print{body{margin:20px}}
    </style></head><body>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #1c1917;padding-bottom:16px;margin-bottom:16px">
            <div><h1>EcoEats</h1><p style="color:#78716c;font-size:12px">Plateforme de livraison</p></div>
            <div style="text-align:right"><h1 style="font-size:16px">${inv.invoiceNumber}</h1><p style="color:#78716c;font-size:12px">${date}</p></div>
        </div>
        <div class="grid">
            <div><p class="label">Client</p><p>${inv.clientName}</p></div>
            <div><p class="label">Restaurant</p><p>${inv.restaurantName}</p></div>
        </div>
        <p class="label" style="margin-top:16px">Articles</p>
        <table>${rows}
            <tr><td>Frais de livraison</td><td style="text-align:right">${inv.deliveryFee.toFixed(2)} €</td></tr>
            <tr><td>Frais de service</td><td style="text-align:right">${inv.serviceFee.toFixed(2)} €</td></tr>
            ${tip}
            <tr class="total"><td>Total</td><td style="text-align:right">${inv.totalAmount.toFixed(2)} €</td></tr>
        </table>
        <p style="color:#78716c;font-size:12px;margin-top:24px">Mode de paiement : ${inv.paymentMethod ?? "—"}</p>
    </body></html>`);
    win.document.close();
    win.focus();
    win.print();
}

type Props = {
    invoice: ApiInvoice;
    onClose: () => void;
};

export function InvoiceModal({ invoice, onClose }: Props) {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-stone-900 text-lg">{invoice.invoiceNumber}</h2>
                        <p className="text-xs text-stone-400 mt-0.5">
                            {new Date(invoice.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                    </div>
                    <button onClick={onClose} className="cursor-pointer text-stone-300 hover:text-stone-600 text-2xl leading-none">×</button>
                </div>

                <div className="p-6 flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-1">Client</p>
                            <p className="text-stone-700">{invoice.clientName}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-1">Restaurant</p>
                            <p className="text-stone-700">{invoice.restaurantName}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-2">Articles</p>
                        <div className="flex flex-col gap-1.5">
                            {invoice.lineItems.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-stone-600"><span className="font-semibold text-stone-800">{item.quantity}×</span> {item.dishName}</span>
                                    <span className="text-stone-700 font-medium">{item.totalPrice.toFixed(2)} €</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-stone-100 pt-4 flex flex-col gap-1.5">
                        <InvoiceRow label="Sous-total" value={invoice.itemsSubtotal} />
                        <InvoiceRow label="Frais de livraison" value={invoice.deliveryFee} />
                        <InvoiceRow label="Frais de service (plateforme)" value={invoice.serviceFee} />
                        {invoice.tipAmount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Pourboire livreur <span className="text-xs">(100% reversé)</span></span>
                                <span>{invoice.tipAmount.toFixed(2)} €</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-stone-900 text-base pt-2 border-t border-stone-200 mt-1">
                            <span>Total</span>
                            <span>{invoice.totalAmount.toFixed(2)} €</span>
                        </div>
                    </div>

                    <div className="bg-stone-50 rounded-xl p-3 text-xs text-stone-500 flex justify-between">
                        <span>Mode de paiement</span>
                        <span className="font-semibold text-stone-700">{invoice.paymentMethod ?? "—"}</span>
                    </div>

                    <button
                        onClick={() => downloadInvoicePdf(invoice)}
                        className="cursor-pointer w-full py-3 rounded-xl font-semibold text-white text-sm transition-all hover:shadow-md hover:scale-[1.01] active:scale-95"
                        style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
                    >
                        Télécharger en PDF
                    </button>
                </div>
            </div>
        </div>
    );
}

function InvoiceRow({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex justify-between text-sm text-stone-500">
            <span>{label}</span>
            <span>{value.toFixed(2)} €</span>
        </div>
    );
}
