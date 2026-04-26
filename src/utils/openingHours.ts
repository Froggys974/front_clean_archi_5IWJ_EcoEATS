import { OpeningHour } from "@/types/food";

const DAY_NAMES = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];

export function isOpenNow(openingHours: OpeningHour[] = []): boolean {
    const now = new Date();
    const day = now.getDay();
    console.log(day);
    
    const time = now.getHours() * 60 + now.getMinutes();
    return openingHours
        .filter((h) => h.day === day)
        .some((h) => {
            const [oh, om] = h.open.split(":").map(Number);
            const [ch, cm] = h.close.split(":").map(Number);
            const open = oh * 60 + om;
            const close = ch * 60 + cm;
            return close < open ? time >= open || time < close : time >= open && time < close;
        });
}

export function getTodaySlots(openingHours: OpeningHour[] = []): string {
    const day = new Date().getDay();
    const slots = openingHours.filter((h) => h.day === day);
    if (slots.length === 0) return "Fermé aujourd'hui";
    return slots.map((s) => `${s.open} – ${s.close}`).join(", ");
}

export { DAY_NAMES };
