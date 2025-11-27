// https://forecast.weather.gov/MapClick.php?lat=40.1852&lon=-75.538&lg=english&&FcstType=digital

import { convertNOAAChancesToAverageMagnitude } from "./src/calculations";
import { getChosenLocation } from "./src/config";
import { getWeatherLine } from "./src/console";
import info from "./src/info";
import { callOut } from "./src/scraper";
import { ThreeHourWeatherModel } from "./src/models/ThreeHourWeather";
import { getDayOfTheWeek, militaryHourToRegularHour } from "./src/utility";

import { printTable, Table }  from 'console-table-printer';
import { ChanceForeast } from "./src/types";

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

    function getRowChances(row: number) {
        const rowData = getRows(row);
        return rowData as any as ChanceForeast[];
    }

    function getRowNumbers(row: number): Number[] {
        const rowData = getRows(row);
        return rowData.map(x => Number(x));
    }

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
    const uniqueDays = allDays.reduce((a,b)=>!a.includes(b) ? [...a,b] : a,[]);
    const allHours = getRowNumbers(2).filter(x => !isNaN(Number(x)));

    const temperatures = getRowNumbers(3);
    const winds = getRowNumbers(6);
    const skyCover = getRowNumbers(9);
    const precipChance = getRowNumbers(10);
    const humidity = getRowNumbers(11);
    const rain = getRowChances(12);
    const thunder = getRowChances(13);
    const snow = getRowChances(14);

    const validatedModel = ThreeHourWeatherModel.formModelFromCandidate({
                temperature, 
                skyCover, 
                wind, 
                humidity, 
                precipChance, 
                rain, 
                snow, 
                thunder, 
                hour
    });

    const hours_3 = splitBy3(allHours);
    const temperatures_3 = splitBy3(temperatures);
    const winds_3 = splitBy3(winds);
    const skyCover_3 = splitBy3(skyCover);
    const precipChance_3 = splitBy3(precipChance);
    const humidity_3 = splitBy3(humidity);
    const rain_3 = splitBy3(rain);
    const thunder_3 = splitBy3(thunder);
    const snow_3 = splitBy3(snow);

    let day = 0;
    let days : string[] = [];

    const weatherTable = new Table();
    const obj : [][] = [];
    //p.addRow({ description: 'red wine', value: 10.212 }, { color: 'red' });
    //p.addRow({ description: 'green gemuse', value: 20.0 }, { color: 'green' });

    let currentDay = '';
    for (let i = 0; i < 48; i++) {

        const middleHourOfThree = Number(hours_3[i][1]);

        if (i === 0) {
            const uniqueDay = uniqueDays[day++];
            currentDay = `${uniqueDay} Today:`;
        }
        else if (middleHourOfThree <= 2 || middleHourOfThree === 24) {
            const uniqueDay = uniqueDays[day++];
            currentDay = `${uniqueDay} ${getDayOfTheWeek(String(uniqueDay))}:`;
        }

        const hour = militaryHourToRegularHour(middleHourOfThree);
        const weather = getWeatherLine(
            {
                temperatures: temperatures_3[i], 
                skyCover: skyCover_3[i], 
                winds: winds_3[i], 
                humidity: humidity_3[i], 
                precipChance: precipChance_3[i], 
                rain: rain_3[i], 
                snow: snow_3[i], 
                thunder: thunder_3[i], 
                hours: hours_3[i]
            });
        
        if(!obj[currentDay]) obj[currentDay] = [];
        obj[currentDay].push(`${hour}: ${weather}`);
    }

    let arr : any = [];

    // this unwinds the seperate arrays of days into an array of objects with days as the keys
    Object.keys(obj).map((day)=>{
        obj[day].forEach((x,i)=>{
            const newData = {[day]:x};
            if(!arr[i]) arr.push(newData);
            else arr[i] = {...arr[i], ...newData};
        });
    });

    arr.forEach(a=>weatherTable.addRow(a))
    
    weatherTable.printTable();
    info.printInfo();

}

(async function () {
    await run();
})();
