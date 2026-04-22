type Status = "PENDING" | "ACCEPTED" | "REFUSED" | "READY" | "DELIVERING" | "DELIVERED" | "PREPARING";

const CONFIG: Record<Status, { label: string; className: string }> = {
    PENDING:    { label: "En attente",      className: "bg-stone-100 text-stone-600" },
    ACCEPTED:   { label: "Acceptée",        className: "bg-blue-100 text-blue-700" },
    REFUSED:    { label: "Refusée",         className: "bg-red-100 text-red-600" },
    PREPARING:  { label: "En préparation",  className: "bg-yellow-100 text-yellow-700" },
    READY:      { label: "Prête",           className: "bg-orange-100 text-orange-700" },
    DELIVERING: { label: "En livraison",    className: "bg-accent/10 text-accent" },
    DELIVERED:  { label: "Livrée",          className: "bg-green-100 text-green-700" },
};

interface StatusBadgeProps {
    status: string;
    size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
    const cfg = CONFIG[status as Status] ?? { label: status, className: "bg-stone-100 text-stone-500" };
    return (
        <span className={`inline-flex items-center font-semibold rounded-full ${size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-3 py-1"} ${cfg.className}`}>
            {cfg.label}
        </span>
    );
}
