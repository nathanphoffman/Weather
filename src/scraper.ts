import axios from "axios";
import { JSDOM } from "jsdom";
import { HEADER_ACCEPT, HEADER_USER_AGENT } from "./config";

const url1 = "https://forecast.weather.gov/MapClick.php?lat=40.1852&lon=-75.538&lg=english&&FcstType=digital";
const url2 = "https://forecast.weather.gov/MapClick.php?w0=t&w1=td&w2=wc&w3=sfcwind&w3u=1&w4=sky&w5=pop&w6=rh&w7=rain&w8=thunder&w9=snow&w10=fzg&w11=sleet&w13u=0&w14u=1&w15u=1&AheadHour=0&FcstType=digital&textField1=40.1852&textField2=-75.538&site=all&unit=0&dd=&bw=&AheadDay.x=46&AheadDay.y=5";
const url3 = "https://forecast.weather.gov/MapClick.php?w0=t&w1=td&w2=wc&w3=sfcwind&w3u=1&w4=sky&w5=pop&w6=rh&w7=rain&w8=thunder&w9=snow&w10=fzg&w11=sleet&w13u=0&w14u=1&w15u=1&AheadHour=48&FcstType=digital&textField1=40.1852&textField2=-75.538&site=all&unit=0&dd=&bw=&AheadDay.x=49&AheadDay.y=11";

export async function callOut(page: number) {

    const url = page === 1 ? url1 : page === 2 ? url2 : url3;

    const config = {
        url,
        method: 'get',
        headers: {
            'User-Agent': HEADER_USER_AGENT,
            'Accept': HEADER_ACCEPT,
        }
    };

    const response = await axios(config);
    const dom = new JSDOM(response.data);

    let tableNodeArr = [...dom.window.document.querySelectorAll('.contentArea > table:nth-child(3)')];
    if (tableNodeArr.length === 1) {
        const table = tableNodeArr[0];
        return (row: number) => {

            // NOAA renders two tables as a single table, each is 17 high, 
            // so we also pull 17 down to grab the second "table" of data
            // below both rows for a single piece of data are gathered (like humidity)
            const row1 = [...table.querySelectorAll('tr')][row];
            const row2 = [...table.querySelectorAll('tr')][row + 17];

            const row1Cells = [...row1.querySelectorAll('td > font > b')];
            const row2Cells = [...row2.querySelectorAll('td > font > b')];

            const row1Content = row1Cells.map(x => x.textContent);
            const row2Content = row2Cells.map(x => x.textContent);

            return [...row1Content, ...row2Content];
        }
    }
    else return (num: number) => { throw "this function should never be executed"; };
}