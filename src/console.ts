// Rain: Rain & Precipitation Potential (%)
// Thunder: Thunder
// Wind: Surface Wind

import { convertNOAAChancesToAverageMagnitude, getMagnitude, getRealFeelTemperature, getStormRating } from "./calculations";
import { color, getHappyFaceFromColor, getRealFeelColor, getStormColor } from "./color";
import { HumidityRanges, WindRanges } from "./config";
import { getPostfixWithColor } from "./postfix";
import { getAverage } from "./utility";

// Temp: Temperature F
export function getWeatherLine(temperature: number[], skyCover: number[], wind: number[], humidity: number[], precipChance: number[], rain: string[], snow: string[], thunder: string[], hours: number[]) {

    const humidityMagnitude = getMagnitude(getAverage(...humidity), HumidityRanges);
    const windMagnitude = getMagnitude(getAverage(...wind), WindRanges);

    const thunderMagnitude = convertNOAAChancesToAverageMagnitude(...thunder);
    const rainMagnitude = convertNOAAChancesToAverageMagnitude(...rain);
    const snowMagnitude = convertNOAAChancesToAverageMagnitude(...snow);

    const humidityPostFix = getPostfixWithColor(humidityMagnitude, "H");
    const windPostFix = getPostfixWithColor(windMagnitude, "W");
    const thunderPostFix = getPostfixWithColor(thunderMagnitude, "T");

    // we only want to calculate sky cover during daytime as this is used to apply a temperature change due to sun
    // for non daytime hours we use 50% cover to not affect the calculation
    const hour = getAverage(...hours);
    const averageSkyCover = hour > 8 && hour < 19 ? getAverage(...skyCover) : 50;

    const realFeelTemperature = getRealFeelTemperature(getAverage(...temperature), humidityMagnitude, windMagnitude, averageSkyCover);
    const stormRating = getStormRating(averageSkyCover, getAverage(...precipChance), rainMagnitude, snowMagnitude, windMagnitude, thunderMagnitude);

    const realFeelColor = getRealFeelColor(realFeelTemperature); 
    const stormColor = getStormColor(stormRating);
    const happyFace = getHappyFaceFromColor(humidityMagnitude, realFeelColor, stormColor);

    const weatherLine = `${color(realFeelTemperature,realFeelColor)}${humidityPostFix} ${color(stormRating,stormColor)}${windPostFix}${thunderPostFix} ${happyFace}`;
    return weatherLine;
}
