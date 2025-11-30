import { Magnitude } from "./types";

export function getDayOfTheWeek(day: string) {
    // !! need to fix this as it will not work on january dates
    return new Date(day + "/" + new Date().getFullYear()).toLocaleString('en-us', { weekday: 'long' });
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

export function militaryHourToRegularHour(mil: number): string {
    if (mil === 12) return "12pm";
    else if (mil > 12) return `${mil - 12}pm`;
    else if (mil === 0) return "12am";
    else return `${mil}am`;
}

export function pipe(fns) {
    return (x) => fns.reduce((acc, fn) => fn(acc), x);
}

export function arrayNotEmpty(arr: any[]): boolean {
    return arr && arr.length > 0;
}

export function stripUndefined(arr: any[]): any[] {
    return arr.filter(x => x !== undefined);
}

export function isNumber(input: unknown) {
    return !isNotNumber(input)
}

export function isNotNumber(input: unknown) {
    return isNaN(Number(input));
}

export function isWithin(min, max) {
    return (input: unknown) => {
        return isNumber(input) && min <= Number(input) <= max;
    }
}

export function isPositive(input: unknown) {
    return isNumber(input) && Number(input) > 0;
}

export function hasValue(input: unknown) {
    return input !== undefined && input !== null && input !== "";
}

export function isString(input: unknown) {
    return hasValue(input) && isNotNumber(input);
}

export function candidateToType<T>(candidate: unknown, validators: ((candidate: unknown) => boolean)[]) {
    const failedFunctionsOrUndefined = validators.map((validator) => validator(candidate) ? undefined : validator[0].name);
    const failedFunctions = stripUndefined(failedFunctionsOrUndefined);

    if (arrayNotEmpty(failedFunctions)) throw `value ${candidate} was unable to be converted to designated type, failed on conversions: ${failedFunctions.join(',')}`;
    else return candidate as T;
}

//export function formModel()