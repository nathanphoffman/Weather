// https://forecast.weather.gov/MapClick.php?lat=40.1852&lon=-75.538&lg=english&&FcstType=digital

import { convertNOAAChancesToAverageMagnitude } from "./src/calculations";
import { getChosenLocation } from "./src/config";
//import { getWeatherLine } from "./src/console";
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
    const uniqueDays = allDays.reduce((a,b)=>!a.includes(b) ? [...a,b] : a,[]);
    const allHours = getRows(2).filter(x => !isNaN(Number(x)));

    const temperatureColumns = getRows(3);
    const windColumns = getRows(6);
    const skyCoverColumns = getRows(9);
    const precipChanceColumns = getRows(10);
    const humidityColumns = getRows(11);
    const rainColumns = getRows(12);
    const thunderColumns = getRows(13);
    const snowColumns = getRows(14);

    const hourlyWeatherRows = allHours.map((hour,i)=>ThreeHourWeatherModel.formModelFromCandidate(({
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

    const averagedThreeHourWeather = hourlyWeatherRowsGroupsOf3.map((threeHours)=>{
        const middleHour = threeHours[1].hour;
        
        
        const threeHourWeather: ThreeHourWeatherModel = {
            hour: militaryHourToRegularHour(middleHour)
        };

        
        return 


        /*

    const humidityMagnitude = getMagnitude(getAverage(...humidity), HumidityRanges);
    const windMagnitude = getMagnitude(getAverage(...wind), WindRanges);

    const thunderMagnitude = thunder;
    const rainMagnitude = rain;
    const snowMagnitude = snow;

    const humidityPostFix = getPostfix(humidityMagnitude, "H");
    const windPostFix = getPostfix(windMagnitude, "W");
    const thunderPostFix = getPostfix(thunderMagnitude, "T");

    const hour = getAverage(...hours);
    const averageSkyCover = getAverage(...skyCover);

    const realFeelTemperature = getRealFeelTemperature(getAverage(...temperature), humidityMagnitude, windMagnitude, averageSkyCover, hour);
    const stormRating = getStormRating(averageSkyCover, getAverage(...precipChance), rainMagnitude, snowMagnitude, windMagnitude, thunderMagnitude);

    const realFeelMagnitude = getRealFeelMagnitude(realFeelTemperature); 
    const stormMagnitude = getStormMagnitude(stormRating);
    const happyFace = getHappyFaceFromMagnitude(humidityMagnitude, realFeelMagnitude, stormMagnitude);

    const weatherLine = `${getWithColor(realFeelMagnitude, String(realFeelTemperature))}${humidityPostFix} ${getWithColor(stormMagnitude, String(stormRating))}${windPostFix}${thunderPostFix} ${happyFace}`;
    return weatherLine;

        */



    })



/*
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
    */

}

(async function () {
    await run();
})();
