import { RealFeelPreferences } from "./config";
import { Magnitude } from "./types";

export const BRIGHT = 1 as const;
export const BLINK = 5 as const;
export const RED = 31 as const;
export const GREEN = 32 as const;
export const YELLOW = 33 as const;

export function getRealFeelColor(realFeel: number): number | undefined {

    if (realFeel >= RealFeelPreferences.VeryHotMin) return RED;
    else if (realFeel >= RealFeelPreferences.HotMin) return YELLOW;
    else if (realFeel >= RealFeelPreferences.WarmMin) return;
    else if (realFeel >= RealFeelPreferences.NiceMin) return GREEN;
    else if (realFeel >= RealFeelPreferences.CoolMin) return;
    else if (realFeel >= RealFeelPreferences.ColdMin) return YELLOW;
    else if (realFeel < RealFeelPreferences.ColdMin) return RED;
}

export function getStormColor(stormRating: number): number | undefined {
    if (stormRating <= 4) return GREEN;
    else if (stormRating < 8) return undefined;
    else if (stormRating < 20) return YELLOW;
    else return RED;
}

export function color(txt, color) {
    if(!color) return txt;
    return `${"\x1b"}[${color}m${txt}${"\x1b"}[0m`
}

export function getHappyFaceFromColor(humidityMagnitude: Magnitude, realFeelColor, stormColor) {
    let happyIndex = 0;

    if(Number(humidityMagnitude) < 2) happyIndex++;

    if(realFeelColor === GREEN) happyIndex++;
    if(stormColor === GREEN) happyIndex++;
    
    if(realFeelColor === YELLOW) happyIndex -= 2;
    if(stormColor === YELLOW) happyIndex -= 2;

    if(realFeelColor === RED) happyIndex -= 3;
    if(stormColor === RED) happyIndex -= 3;

    if(happyIndex > 2) return "😎";
    else if(happyIndex > 1) return "🙂";
    else return " ";
}