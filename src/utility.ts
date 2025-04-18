import { Magnitude } from "./types";

export function getDayOfTheWeek(day: string) {
    // !! need to fix this as it will not work on january dates
    return new Date(day + "/" + new Date().getFullYear()).toLocaleString('en-us', {  weekday: 'long' });
}

export function getAverage(...numbers: number[] | Magnitude[]) {
    // !! fix this!
    const average = Math.round(numbers.reduce((a, b) => {
        const aa = Number(a);
        const bb = Number(b);
        return aa + bb as any;
    }) / numbers.length);
    return average;
}