import { ChanceRanges } from "./config";
import { Magnitude, MagnitudeRange } from "./types";
import { getAverage } from "./utility";

export function convertNOAAChancesToAverageMagnitude(...chances: string[]): Magnitude {
    const magnitudes = chances.map((chance) => getMagnitude(chance, ChanceRanges));
    const averageMag = getAverage(...magnitudes);
    if (averageMag > 4) return 4 as Magnitude;
    else if (averageMag >= 0) return averageMag as Magnitude;
    else throw "the average chance calculation was beyond the expected range of values";
}

export function isInRange(value: number | string, range: number[] | string) {
    if (typeof value === 'string' && typeof range === 'string') return value === range;
    else if (typeof value === 'number' && typeof range === 'string') return ChanceRanges[value] === range;
    else if (typeof value === 'number' && typeof range === 'object' && range.length === 2) {
        if (range[0] === -1 && value <= range[1]) return true;
        if (range[1] === -1 && value >= range[0]) return true;
        else return range[0] <= value && value <= range[1];
    }
    else throw "an unexpected type was encountered when performing a range comparison";
}

export function getMagnitude(value: number | string, range: MagnitudeRange): Magnitude {
    const magnitude = Object.keys(range).find(key => isInRange(value, range[key]));

    // !! adjust typing going forward
    return magnitude as any as Magnitude;
}

export function getRealFeelTemperature(temperature: number, humidity: number, wind: number, averageSkyCover: number, hour: number) {
    // this is a rough approximation, simply adjusting by steps of 5 based on the calculated magnitude of these factors (the number of W and H letters in the output)

    const SUNRISE = 7 as const;
    const SUNSET = 18 as const;
    const MIDDAY = (7+18)/2;
    const DIFFDAY = MIDDAY-SUNRISE;

    const isDayTime = hour > SUNRISE && hour < SUNSET;

    // the reason for the reduction in temperature of -3 is that being outside in the shade even in calm breeze has more windflow than indoors, and outdoor temperatures do already include sunlight to some extent
    let realFeel = temperature + 4*(Math.pow(humidity,(1/3)) - wind) - 3;

    if (isDayTime && averageSkyCover < 95) {
        const dayTimeAmount = DIFFDAY - Math.abs(MIDDAY - hour);
        realFeel += dayTimeAmount * 2 * ((100 - averageSkyCover) / 100);
    }

    const realFeelIn5s = Math.round(realFeel / 5) * 5;
    return realFeelIn5s;
}

export function getStormRating(skyCover: number, precipChance: number, rainMagnitude: Magnitude, snowMagnitude: Magnitude, windMagnitude: Magnitude, thunderMagnitude: Magnitude) {

    // practical max of 10
    const skyCoverOutOf10 = 10 * (skyCover / 100);

    // max of 25 in rare cases
    const thunderPenalty = thunderMagnitude * 5;

    // practical max of 32 in rare cases
    const windPenalty = windMagnitude * windMagnitude * (windMagnitude / 2);

    // practical max of 35 in rare cases
    const precipPercent = (precipChance / 100);
    const precipPercentSquared = precipPercent * precipPercent;
    const percipPenalty =  precipPercentSquared * ((snowMagnitude + rainMagnitude) * 5) + Math.round(precipPercentSquared * 10);

    const stormRating = skyCoverOutOf10 + windPenalty + percipPenalty + thunderPenalty;
    if (stormRating < 10) return Math.round(stormRating);
    else return 5 * Math.round(stormRating / 5);
}
