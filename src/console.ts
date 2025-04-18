// Rain: Rain & Precipitation Potential (%)
// Thunder: Thunder
// Wind: Surface Wind

import { getAverageChance, getMagnitude, getRealFeelTemperature, getStormRating } from "./calculations";
import { color, getHappyIndex, getRealFeelColor, getStormColor } from "./color";
import { ChanceRanges, HumidityRanges, WindRanges } from "./config";
import { getPostfixWithColor } from "./postfix";
import { getAverage } from "./utility";

// Temp: Temperature F
export function getWeatherLine(temperature: number[], skyCover: number[], wind: number[], humidity: number[], precipChance: number[], rain: string[], snow: string[], thunder: string[], hours: number[]) {

    const humidityMagnitude = getMagnitude(getAverage(...humidity), HumidityRanges);
    const windMagnitude = getMagnitude(getAverage(...wind), WindRanges);

    const thunderMagnitude = getMagnitude(getAverageChance(...thunder), ChanceRanges);
    const rainMagnitude = getMagnitude(getAverageChance(...rain), ChanceRanges);
    const snowMagnitude = getMagnitude(getAverageChance(...snow), ChanceRanges);

    const humidityPostFix = getPostfixWithColor(humidityMagnitude, "H");
    const windPostFix = getPostfixWithColor(windMagnitude, "W");
    const thunderPostFix = getPostfixWithColor(thunderMagnitude, "T");

    // we only want to calculate sky cover during daytime as this is used to apply a temperature change due to sun, 
    // night time (and early morning / evening) application of 50 = 50% = 0 change to temperature
    const hour = getAverage(...hours);
    const averageSkyCover = hour > 8 && hour < 19 ? getAverage(...skyCover) : 50;

    const realFeelTemperature = getRealFeelTemperature(getAverage(...temperature), humidityMagnitude, windMagnitude, averageSkyCover);
    const stormRating = getStormRating(averageSkyCover, getAverage(...precipChance), rainMagnitude, snowMagnitude, windMagnitude, thunderMagnitude);

    const realFeelColor = getRealFeelColor(realFeelTemperature); 
    const stormColor = getStormColor(stormRating);
    const happyFace = getHappyIndex(humidityMagnitude, realFeelColor, stormColor);

    const weatherLine = `${color(realFeelTemperature,realFeelColor)}${humidityPostFix} ${color(stormRating,stormColor)}${windPostFix}${thunderPostFix} ${happyFace}\n`;
    return weatherLine;
}
