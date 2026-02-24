import { convertNOAAChancesToAverageMagnitude, getMagnitude, getRealFeelTemperature, getStormRating, isAnyTemperatureFreezing } from "./calculations";
import { getFreezeIconFromTemperatures, getHappyFaceFromMagnitude, getRealFeelMagnitude, getStormMagnitude, underline } from "./output/color";
import { HumidityRanges, WindRanges } from "./config";
import { ThreeHourWeatherModel } from "./types/threeHourWeather";
import { getPostfix, getWithColor } from "./output/postfix";
import { callOut } from "./scraper";
import { getAverage, militaryHourToRegularHour } from "./utility";

export async function getParseScrapedData() {

    // get the 1st, 2nd, and 3rd weather pages from NOAA
    const results = await Promise.all([callOut(1), callOut(2), callOut(3)]);

    const getRows1 = results[0];
    const getRows2 = results[1];
    const getRows3 = results[2];

    function getRows(row: number) {
        const rows = [...getRows1(row), ...getRows2(row), ...getRows3(row)];
        return rows;
    }

    const allDays = getRows(1).filter(x => x.toUpperCase() !== 'DATE');
    const uniqueDays = allDays.reduce((a, b) => !a.includes(b) ? [...a, b] : a, [] as string[]);
    const allHours = getRows(2).filter(x => !isNaN(Number(x)));

    const temperatureColumns = getRows(3);
    const windColumns = getRows(6);
    const skyCoverColumns = getRows(9);
    const precipChanceColumns = getRows(10);
    const humidityColumns = getRows(11);
    const rainColumns = getRows(12);
    const thunderColumns = getRows(13);
    const snowColumns = getRows(14);

    const hourlyWeatherRows = allHours.map((hour, i) => ThreeHourWeatherModel.formModelFromCandidate(({
        temperature: temperatureColumns[i],
        skyCover: skyCoverColumns[i],
        wind: windColumns[i],
        humidity: humidityColumns[i],
        precipChance: precipChanceColumns[i],
        rain: rainColumns[i],
        snow: snowColumns[i],
        thunder: thunderColumns[i],
        hour
    })));

    return {hourlyWeatherRows, uniqueDays};

}

export function getWeatherLines(hourlyWeatherRowsGroupsOf3) {

    const weatherLines = hourlyWeatherRowsGroupsOf3.map((threeHours) => {
        const middleHour = threeHours[1].hour;
        const regularTime = militaryHourToRegularHour(middleHour);

        const allThreeStormRatings = threeHours.map((weatherRow)=>{
            const { wind, thunder, rain, snow, skyCover, precipChance } = weatherRow;

            const windMagnitude = getMagnitude(Number(wind), WindRanges);
            const thunderMagnitude = convertNOAAChancesToAverageMagnitude(thunder);
            const rainMagnitude = convertNOAAChancesToAverageMagnitude(rain);
            const snowMagnitude = convertNOAAChancesToAverageMagnitude(snow);

            return Number(getStormRating(skyCover, precipChance, rainMagnitude, snowMagnitude, windMagnitude, thunderMagnitude));
        });

        const lowestStorm = Math.min(...allThreeStormRatings);
        const highestStorm = Math.max(...allThreeStormRatings);
        const stormDelta = highestStorm-lowestStorm;

        const unstableWeatherIcon = stormDelta >= lowestStorm + 5 ? "⚠️" : "";

        const humidity = threeHours.map(x => x.humidity);
        const wind = threeHours.map(x => x.wind);
        const thunder = threeHours.map(x => x.thunder);
        const rain = threeHours.map(x => x.rain);
        const snow = threeHours.map(x => x.snow);
        const skyCover = threeHours.map(x => x.skyCover);
        const temperature = threeHours.map(x => x.temperature);
        const precipChance = threeHours.map(x => x.precipChance);

        // Magnitudes
        const humidityMagnitude = getMagnitude(getAverage(...humidity), HumidityRanges);
        const windMagnitude = getMagnitude(getAverage(...wind), WindRanges);
        const thunderMagnitude = convertNOAAChancesToAverageMagnitude(...thunder);
        const rainMagnitude = convertNOAAChancesToAverageMagnitude(...rain);
        const snowMagnitude = convertNOAAChancesToAverageMagnitude(...snow);

        const humidityPostFix = getPostfix(humidityMagnitude, "H");
        const windPostFix = getPostfix(windMagnitude, "W");
        const thunderPostFix = getPostfix(thunderMagnitude, "T");

        const averageSkyCover = getAverage(...skyCover);
        const realFeelTemperature = getRealFeelTemperature(getAverage(...temperature), humidityMagnitude, windMagnitude, averageSkyCover, middleHour);
        const stormRating = getStormRating(averageSkyCover, getAverage(...precipChance), rainMagnitude, snowMagnitude, windMagnitude, thunderMagnitude);

        const realFeelMagnitude = getRealFeelMagnitude(realFeelTemperature);
        const stormMagnitude = getStormMagnitude(stormRating);
        const happyFace = getHappyFaceFromMagnitude(humidityMagnitude, realFeelMagnitude, stormMagnitude);
        const freezeIcon = getFreezeIconFromTemperatures(...temperature);

        const weatherLine = `${getWithColor(realFeelMagnitude, String(realFeelTemperature))}${humidityPostFix} ${getWithColor(stormMagnitude, String(stormRating))}${unstableWeatherIcon}${windPostFix}${thunderPostFix} ${happyFace}${freezeIcon}`;

        return {
            middleHour,
            regularTime,
            weatherLine
        };

    });

    return weatherLines;

}