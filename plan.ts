// https://forecast.weather.gov/MapClick.php?lat=40.1852&lon=-75.538&lg=english&&FcstType=digital

//import './extensions.ts';

import axios from "axios";
import {JSDOM} from "jsdom";


const windSpeed = ["", "W", "WW", "WWW", "WWW+"] as const;
const humidity = ["", "H", "HH", "HHH", "HHH+"] as const;
const thunder = ["", "T", "TT", "TTT", "TTT+"] as const;

type WindSpeed = typeof windSpeed[number];
type Humidity = typeof humidity[number];
type Thunder = typeof thunder[number];

// 4 is represented as "more than 3: 3+"
type Magnitude = 0 | 1 | 2 | 3 | 4;
type Postfix = WindSpeed | Humidity | Thunder;
type PostfixLetter =  "W" | "H" | "T"

const LESS = -1, MORE = -1;

type MagnitudeRange = {
    [key in Magnitude]: number[] | ChanceForeast
}

const CHANCEFORECAST = ["--", "SChc", "Chc", "Lkly", "Ocnl"] as const;
type ChanceForeast = typeof CHANCEFORECAST[number];

const HumidityRanges : MagnitudeRange = {
    0: [LESS,50],
    1: [50,60],
    2: [60,70],
    3: [80,90],
    4: [91,MORE]
} as const;

const WindRanges : MagnitudeRange = {
    0: [LESS,14],
    1: [15,24],
    2: [25,31],
    3: [32,38],
    4: [39,MORE]
} as const;

const ChanceRanges : MagnitudeRange = {
    0: "--",
    1: "SChc", // Small Chance
    2: "Chc",  // Chance
    3: "Lkly", // Likely
    4: "Ocnl", // Occasional (max chance)
};

function getPostfix(magnitude: Magnitude, postFixLetter: PostfixLetter) : Postfix {
    if(magnitude > 4 || magnitude < 0) throw "magnitude cannot be greater than 4 or less than 0";
    else if(postFixLetter = "W") return windSpeed[magnitude];
    else if(postFixLetter = "H") return humidity[magnitude];
    else if(postFixLetter = "T") return thunder[magnitude];
    else throw `Postfix ${postFixLetter ?? "empty"} is not setup.`;
}

function getWindMagnitude(windSpeed: number) {

}

function getAverage(...numbers : number[] | Magnitude[]) {
    // !! fix this!
    const average = Math.round(numbers.reduce((a,b)=>{
        const aa = Number(a);
        const bb = Number(b);
        return aa + bb as any;
    })/numbers.length);
    return average;
}

function getAverageChance(...chances: string[]) : Magnitude {
    const magnitudes = chances.map((chance)=>getMagnitude(chance,ChanceRanges));
    const averageMag = getAverage(...magnitudes);
    if(averageMag > 4) return 4 as Magnitude;
    else if (averageMag >= 0) return averageMag as Magnitude;
    else throw "the average chance calculation was beyond the expected range of values";
}


function isInRange(value: number | string, range: number[] | string) {
    if(typeof value === 'string' && typeof range === 'string') return value === range;
    else if(typeof value === 'number' && typeof range === 'string') return ChanceRanges[value] === range;
    else if (typeof value === 'number' && typeof range === 'object' && range.length === 2) {
        if(range[0] === -1 && value <= range[1]) return true;
        if(range[1] === -1 && value >= range[0]) return true;
        else return range[0] <= value && value <= range[1];
    }
    else throw "an unexpected type was encountered when performing a range comparison";
}

function getMagnitude(value: number | string, range: MagnitudeRange) : Magnitude {
    const magnitude = Object.keys(range).find(key=>isInRange(value, range[key]));

    // !! adjust typing going forward
    return magnitude as any as Magnitude;
}

function getRealFeelTemperature(temperature: number, humidity: number, wind: number) {
    // this is a rough approximation, simply adjusting by steps of 5 based on the calculated magnitude of these factors (the number of W and H letters in the output)
    const realFeel = temperature + 5*(+humidity - wind);
    const realFeelIn5s = Math.round(realFeel/5)*5;
    return realFeelIn5s;
}

function getStormRating(skyCover: number, precipChance: number, rainMagnitude: Magnitude, snowMagnitude: Magnitude, windMagnitude: Magnitude, thunderMagnitude: Magnitude) {
    
    // practical max of 10
    const skyCoverOutOf10 = 10*(skyCover/100);

    // practical max of 25 in rare cases
    const windPenalty = windMagnitude*windMagnitude;

    // practical max of 25 in rare cases
    const percipPenalty = (precipChance/100)*((snowMagnitude + rainMagnitude)*3) + Math.round(precipChance/10);

    // practical max of 25 in rare cases
    const thunderPenalty = thunderMagnitude*5;

    const stormRating = skyCoverOutOf10 + windPenalty + percipPenalty + thunderPenalty;
    return Math.round(stormRating);
}


// Rain: Rain & Precipitation Potential (%)
// Thunder: Thunder
// Wind: Surface Wind
// Temp: Temperature F
function getWeatherLine(temperature: number[], skyCover: number[], wind: number[], humidity: number[], precipChance: number[], rain: string[], snow: string[], thunder: string[]) {

    const humidityMagnitude = getMagnitude(getAverage(...humidity), HumidityRanges);
    const windMagnitude = getMagnitude(getAverage(...wind), WindRanges);

    const thunderMagnitude = getMagnitude(getAverageChance(...thunder), ChanceRanges);
    const rainMagnitude = getMagnitude(getAverageChance(...rain), ChanceRanges);
    const snowMagnitude = getMagnitude(getAverageChance(...snow), ChanceRanges);

    const humidityPostFix = getPostfix(humidityMagnitude, "H");
    const windPostFix = getPostfix(windMagnitude, "W");
    const thunderPostFix = getPostfix(thunderMagnitude, "T");

    const realFeelTemperature = getRealFeelTemperature(getAverage(...temperature), humidityMagnitude, windMagnitude);
    const stormRating = getStormRating(getAverage(...skyCover), getAverage(...precipChance), rainMagnitude, snowMagnitude, windMagnitude, thunderMagnitude);

    return `${realFeelTemperature} ${stormRating}${windPostFix}${thunderPostFix}`
}

console.log(getWeatherLine(
    [61, 59, 57],
    [64, 51, 49],
    [21, 22, 21],
    [41, 42, 43],
    [27, 20, 18],
    ['Chc', 'SChc', 'SChc'],
    ['--','--','--'],
    ['SChc','--','--']
));

const url = "https://forecast.weather.gov/MapClick.php?lat=40.1852&lon=-75.538&lg=english&&FcstType=digital";


let data = {};

const HEADER_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36';
const HEADER_ACCEPT = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';

const config = {
    url,
    method: 'get',
    headers: {
        'User-Agent': HEADER_USER_AGENT,
        'Accept': HEADER_ACCEPT,
    }
};

axios(config).then((response) => {
    console.log("NO CACHE FOUND - MAKING CALL TO BGG");
    const dom = new JSDOM(response.data);
    
    let tableNodeArr = [...dom.window.document.querySelectorAll('.contentArea > table:nth-child(3)')];
    if(tableNodeArr.length === 1) {
        const table = tableNodeArr[0];
        console.log(table);

        function getRows(row: number) {
            const row1 = [...table.querySelectorAll('tr')][row];
            const row2 = [...table.querySelectorAll('tr')][row + 17];

            const row1Cells = [...row1.querySelectorAll('td > font > b')];
            const row2Cells = [...row2.querySelectorAll('td > font > b')];

            const row1Content = row1Cells.map(x=>x.textContent);
            const row2Content = row2Cells.map(x=>x.textContent);

            return [...row1Content, ...row2Content];
        }

        function getRowChances(row: number) {
            const rowData = getRows(row);
            return rowData as any as ChanceForeast;
        }

        function getRowNumbers(row: number) : Number[] {
            const rowData = getRows(row);
            return rowData.map(x=>Number(x));
        }

        const temperatureRow = 3;
        const windRow = 6;
        const skyCoverRow = 9;
        const precipChanceRow = 10;
        const humidityRow = 11;
        const rainRow = 12;
        const thunderRow = 13;
        const snowRow = 14;
        //const freezingRainRow = 15;
        //const sleetRow = 16;

        const temperatures = getRowNumbers(temperatureRow);
        console.log(temperatures);

        const rains = getRowChances(rainRow);
        console.log(rains);

        //const winds = [...table.querySelectorAll('tr')][6];
    }
    else throw "no table found";


});



