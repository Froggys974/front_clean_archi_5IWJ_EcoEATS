const DAY_IN_MS = 1000 * 60 * 60 * 24;

export function isOfferActive(startDate: string, endDate: string, now = Date.now()): boolean {
    const startMs = new Date(startDate).getTime();
    const endMs = new Date(endDate).getTime();

    return Number.isFinite(startMs) && Number.isFinite(endMs) && now >= startMs && now <= endMs;
}

export function getRemainingOfferDays(endDate: string, now = Date.now()): number {
    const endMs = new Date(endDate).getTime();

    if (!Number.isFinite(endMs)) {
        return -1;
    }

    const diffMs = endMs - now;
    return Math.max(0, Math.ceil(diffMs / DAY_IN_MS));
}

export function formatOfferPercent(offer: number): string {
    return `${offer}% offerts`;
}

export function formatRemainingDays(days: number): string {
    if(days > 1) return `Plus que ${days} jours`;
    return `Plus que ${days} jour`
}

