import { OpeningHour } from "@/types/food";

const DAY_NAMES = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];

export function isOpenNow(openingHours: OpeningHour[] = []): boolean {
    const now = new Date();
    const day = now.getDay();
    const time = now.getHours() * 60 + now.getMinutes();
    return openingHours
        .filter((hour) => hour.dayOfWeek === day)
        .some((hour) => {
            const [oh, om] = hour.openTime.split(":").map(Number);
            const [ch, cm] = hour.closeTime.split(":").map(Number);
            const open = oh * 60 + (om ?? 0);
            const close = ch * 60 + (cm ?? 0);
            return close < open ? time >= open || time < close : time >= open && time < close;
        });
}

export type RestaurantOpenState = "open" | "closed_hours" | "temporarily_closed" | "closed";

export function getOpenState(status: string, openingHours: OpeningHour[]): RestaurantOpenState {
    if (status === "TEMPORARILY_CLOSED") return "temporarily_closed";
    if (status === "CLOSED") return "closed";
    return isOpenNow(openingHours) ? "open" : "closed_hours";
}

export function getTodaySlots(openingHours: OpeningHour[] = []): string {
    const day = new Date().getDay();
    const slots = openingHours.filter((hour) => hour.dayOfWeek === day);
    if (slots.length === 0) return "Fermé aujourd'hui";
    return slots.map((slot) => `${slot.openTime} – ${slot.closeTime}`).join(", ");
}

export { DAY_NAMES };
