// https://forecast.weather.gov/MapClick.php?lat=40.1852&lon=-75.538&lg=english&&FcstType=digital

import { getWeatherLine } from "./src/console";
import { callOut } from "./src/scraper";
import { ChanceForeast } from "./src/types";
import { getDayOfTheWeek } from "./src/utility";

//import './extensions.ts';


async function run() {

    const getRows1 = await callOut(1);
    const getRows2 = await callOut(2);
    const getRows3 = await callOut(3);

    function getRows(row: number) {
        const rows = [...getRows1(row), ...getRows2(row), ...getRows3(row)];
        return rows;
    }

    function getRowChances(row: number) {
        const rowData = getRows(row);
        return rowData as any as ChanceForeast[];
    }

    function getRowNumbers(row: number): Number[] {
        const rowData = getRows(row);
        return rowData.map(x => Number(x));
    }

    function splitBy3(arr: any[], prev?: any[][]): any[][] {
        const deepClone = [...arr];
        const take3 = deepClone.splice(0, 3);
        if (arr.length < 3) return prev;
        else if (!prev || prev.length === 0) return splitBy3(deepClone, [take3]);
        else if (prev && prev.length > 0 && arr.length > 2) return splitBy3(deepClone, [...prev, take3]);
    }

    //const freezingRainRow = 15;
    //const sleetRow = 16;

    const allDays = getRows(1).filter(x => x.toUpperCase() !== 'DATE');
    const uniqueDays = allDays.reduce((a,b)=>!a.includes(b) ? [...a,b] : a,[]);
    const allHours = getRowNumbers(2).filter(x => !isNaN(Number(x)));

    const hours = splitBy3(allHours);
    const temperatures = splitBy3(getRowNumbers(3));
    const winds = splitBy3(getRowNumbers(6));
    const skyCover = splitBy3(getRowNumbers(9));
    const precipChance = splitBy3(getRowNumbers(10));
    const humidity = splitBy3(getRowNumbers(11));
    const rains = splitBy3(getRowChances(12));
    const thunder = splitBy3(getRowChances(13));
    const snow = splitBy3(getRowChances(14));

    let day = 0;
    let lineStr = '';

    function milToReg(mil: number): string {
        if (mil === 12) return "12pm";
        else if (mil > 12) return `${mil - 12}pm`;
        else if (mil === 0) return "12am";
        else return `${mil}am`;
    }

    console.log("\nWeather from NOAA:\n")

    for (let i = 0; i < 48; i++) {

        const hour = milToReg(hours[i][1]);
        const weather = getWeatherLine(temperatures[i], skyCover[i], winds[i], humidity[i], precipChance[i], rains[i], snow[i], thunder[i], hours[i]);
        lineStr += `|  ${hour}: ${weather}`;


        if (i === 0) {
            const uniqueDay = uniqueDays[day++];
            console.log(`${uniqueDay} Today:`);
        }
        else if (hours[i][1] >= 21 || hours[i][1] === 23) {
            console.log(lineStr);
            lineStr = '';
            console.log(" ")
            const uniqueDay = uniqueDays[day++];
            console.log(`${uniqueDay} ${getDayOfTheWeek(String(uniqueDay))}:`);
        }
        else if (i === 47) {
            console.log(lineStr);
        }

    }
}

(async function () {
    await run();
})();