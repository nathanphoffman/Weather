// https://forecast.weather.gov/MapClick.php?lat=40.1852&lon=-75.538&lg=english&&FcstType=digital

import { convertNOAAChancesToAverageMagnitude, getMagnitude, getRealFeelTemperature, getStormRating } from "./src/calculations";
import { getChosenLocation, HumidityRanges, WindRanges } from "./src/config";
//import { getWeatherLine } from "./src/console";
import info from "./src/info";
import { callOut } from "./src/scraper";
import { ThreeHourWeatherModel } from "./src/models/ThreeHourWeather";
import { getAverage, getDayOfTheWeek, militaryHourToRegularHour } from "./src/utility";

import { printTable, Table } from 'console-table-printer';
import { ChanceForeast } from "./src/types";
import { getPostfix, getWithColor } from "./src/postfix";
import { getHappyFaceFromMagnitude, getRealFeelMagnitude, getStormMagnitude } from "./src/color";

//import './extensions.ts';

// test comment
async function run() {

    const getRows1 = await callOut(1);
    const getRows2 = await callOut(2);
    const getRows3 = await callOut(3);

    function getRows(row: number) {
        const rows = [...getRows1(row), ...getRows2(row), ...getRows3(row)];
        return rows;
    }

    /*
    function getRowChances(row: number) {
        const rowData = getRows(row);
        return rowData as any as ChanceForeast[];
    }

    function getRowNumbers(row: number): Number[] {
        const rowData = getRows(row);
        return rowData.map(x => Number(x));
    }
*/
    function splitBy3<T>(arr: T[], prev?: T[][]): T[][] {
        const deepClone = [...arr];
        const take3 = deepClone.splice(0, 3);
        if (arr.length < 3) return prev;
        else if (!prev || prev.length === 0) return splitBy3(deepClone, [take3]);
        else if (prev && prev.length > 0 && arr.length > 2) return splitBy3(deepClone, [...prev, take3]);
    }

    //const freezingRainRow = 15;
    //const sleetRow = 16;

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

    const hourlyWeatherRowsGroupsOf3 = splitBy3(hourlyWeatherRows);
    console.log(hourlyWeatherRowsGroupsOf3);

    const weatherLines = hourlyWeatherRowsGroupsOf3.map((threeHours) => {
        const middleHour = threeHours[1].hour;
        const militaryTime = militaryHourToRegularHour(middleHour);

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

        const weatherLine = `${getWithColor(realFeelMagnitude, String(realFeelTemperature))}${humidityPostFix} ${getWithColor(stormMagnitude, String(stormRating))}${windPostFix}${thunderPostFix} ${happyFace}`;
        return {
            middleHour,
            day: null,
            weatherLine
        };

    });

    console.log(weatherLines);

    let currentDay = uniqueDays[0];
    const obj: string[][] = [];
    obj[currentDay] = [];
    let dayTracker = 0;

    weatherLines.forEach(({ middleHour, weatherLine }, i, arr) => {

        const prevMiddleHour = i === 0 ? 0 : arr[i - 1].middleHour;

        if (prevMiddleHour > middleHour) { 
            currentDay = uniqueDays[++dayTracker]; 
            obj[currentDay] = []
        }
        
        obj[currentDay].push(`${middleHour}: ${weatherLine}`);

    });

    const arr = [];

    // this unwinds the seperate arrays of days into an array of objects with days as the keys
    Object.keys(obj).map((day) => {
        obj[day].forEach((x, i) => {
            const newData = { [day]: x };
            if (!arr[i]) arr.push(newData);
            else arr[i] = { ...arr[i], ...newData };
        });
    });

    const weatherTable = new Table();

    arr.forEach(a => weatherTable.addRow(a))

    weatherTable.printTable();
    info.printInfo();




    /*
    
    
                const middleHourOfThree = Number(hours_3[i][1]);
        
                if (i === 0) {
                    const uniqueDay = uniqueDays[day++];
                    currentDay = `${uniqueDay} Today:`;
                }
                else if (middleHourOfThree <= 2 || middleHourOfThree === 24) {
                    const uniqueDay = uniqueDays[day++];
                    currentDay = `${uniqueDay} ${getDayOfTheWeek(String(uniqueDay))}:`;
                }
        
    
    */

    /*
    
        let day = 0;
        let days: string[] = [];
    
        const weatherTable = new Table();
        const obj: [][] = [];
    
        let currentDay = '';
        for (let i = 0; i < 48; i++) {
    
            if (!obj[currentDay]) obj[currentDay] = [];
            obj[currentDay].push(`${hour}: ${weather}`);
        }
    
        let arr: any = [];
    
        // this unwinds the seperate arrays of days into an array of objects with days as the keys
        Object.keys(obj).map((day) => {
            obj[day].forEach((x, i) => {
                const newData = { [day]: x };
                if (!arr[i]) arr.push(newData);
                else arr[i] = { ...arr[i], ...newData };
            });
        });
    
        arr.forEach(a => weatherTable.addRow(a))
    
        weatherTable.printTable();
        info.printInfo();
    
    */
}


(async function () {
    await run();
})();
