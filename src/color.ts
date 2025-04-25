import { RealFeelPreferences, StormPreferences } from "./config";
import { Magnitude } from "./types";

export const BRIGHT = 1 as const;
export const BLINK = 5 as const;
export const RED = 31 as const;
export const GREEN = 32 as const;
export const YELLOW = 33 as const;
export const WHITE = 37 as const;

export function getRealFeelMagnitude(realFeel: number): Magnitude {

    if (realFeel >= RealFeelPreferences.ExtremelyHotMin) return 4;
    else if (realFeel >= RealFeelPreferences.VeryHotMin) return 3;
    else if (realFeel >= RealFeelPreferences.HotMin) return 2;
    else if (realFeel >= RealFeelPreferences.WarmMin) return 1;
    else if (realFeel >= RealFeelPreferences.NiceMin) return 0;
    else if (realFeel >= RealFeelPreferences.CoolMin) return 1;
    else if (realFeel >= RealFeelPreferences.ColdMin) return 2;
    else if (realFeel >= RealFeelPreferences.VeryColdMin) return 3;
    else if (realFeel < RealFeelPreferences.VeryColdMin) return 4;
}

export function getStormMagnitude(stormRating: number): Magnitude {
    if (stormRating < StormPreferences.AverageMin) return 0;
    else if (stormRating < StormPreferences.PoorMin) return 1;
    else if (stormRating < StormPreferences.BadMin) return 2;
    else if (stormRating < StormPreferences.VeryBadMin) return 3;
    else return 4;
}

export function color(txt, color) {
    if(!color) return txt;
    return `${"\x1b"}[${color}m${txt}${"\x1b"}[0m`
}

export function getHappyFaceFromMagnitude(humidityMagnitude: Magnitude, realFeelMagnitude: Magnitude, stormMagnitude: Magnitude) {
    let sadIndex = 0;

    sadIndex = sadIndex + realFeelMagnitude + stormMagnitude + humidityMagnitude/2;

    if(sadIndex === 0) return "😎";
    else if(sadIndex <= 1) return "🙂";
    else return " ";
}