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

export function militaryToRegularTime(mil: number): string {
    if (mil === 12) return "12pm";
    else if (mil > 12) return `${mil - 12}pm`;
    else if (mil === 0) return "12am";
    else return `${mil}am`;
}

export function pipe (fns) { 
    return (x) => fns.reduce((acc, fn) => fn(acc), x);
}