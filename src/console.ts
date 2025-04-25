// Rain: Rain & Precipitation Potential (%)
// Thunder: Thunder
// Wind: Surface Wind

import { convertNOAAChancesToAverageMagnitude, getMagnitude, getRealFeelTemperature, getStormRating } from "./calculations";
import { color, getHappyFaceFromMagnitude, getRealFeelMagnitude, getStormMagnitude } from "./color";
import { HumidityRanges, WindRanges } from "./config";
import { getPostfix, getWithColor } from "./postfix";
import { getAverage } from "./utility";

// Temp: Temperature F
export function getWeatherLine(temperature: number[], skyCover: number[], wind: number[], humidity: number[], precipChance: number[], rain: string[], snow: string[], thunder: string[], hours: number[]) {

    const humidityMagnitude = getMagnitude(getAverage(...humidity), HumidityRanges);
    const windMagnitude = getMagnitude(getAverage(...wind), WindRanges);

    const thunderMagnitude = convertNOAAChancesToAverageMagnitude(...thunder);
    const rainMagnitude = convertNOAAChancesToAverageMagnitude(...rain);
    const snowMagnitude = convertNOAAChancesToAverageMagnitude(...snow);

    const humidityPostFix = getPostfix(humidityMagnitude, "H");
    const windPostFix = getPostfix(windMagnitude, "W");
    const thunderPostFix = getPostfix(thunderMagnitude, "T");

    const hour = getAverage(...hours);
    const averageSkyCover = getAverage(...skyCover);
    const isDayTime = hour > 8 && hour < 19;

    const realFeelTemperature = getRealFeelTemperature(getAverage(...temperature), humidityMagnitude, windMagnitude, averageSkyCover, isDayTime);
    const stormRating = getStormRating(averageSkyCover, getAverage(...precipChance), rainMagnitude, snowMagnitude, windMagnitude, thunderMagnitude);

    const realFeelMagnitude = getRealFeelMagnitude(realFeelTemperature); 
    const stormMagnitude = getStormMagnitude(stormRating);
    const happyFace = getHappyFaceFromMagnitude(humidityMagnitude, realFeelMagnitude, stormMagnitude);

    const weatherLine = `${getWithColor(realFeelMagnitude, String(realFeelTemperature))}${humidityPostFix} ${getWithColor(stormMagnitude, String(stormRating))}${windPostFix}${thunderPostFix} ${happyFace}`;
    return weatherLine;
}
