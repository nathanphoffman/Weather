import { MagnitudeRange, RealFeelMin } from "./types";

export const latLon = {
    default: [40.1852, -75.538], //royersford
    ny: [40.7198, -73.993], //nyc
    p: [39.99310, -74.78790], //philly
    cabin: [41.39127,-76.75871]
};

export function getChosenLocation() {
    const argument = (process.argv as any[])?.splice(2)[0];
    const chosenLocation = !argument ? "default" : argument;
    console.log(`\nWeather from NOAA for ${chosenLocation}:\n`);
    return String(chosenLocation);
}

export function getLatLon() {
    const chosenLocation = getChosenLocation();
    const chosenLatLon = latLon[chosenLocation];
    const queryString = `lat=${chosenLatLon[0]}&lon=${chosenLatLon[1]}`;
    return queryString;
}

const LESS = -1, MORE = -1;

export const HumidityRanges: MagnitudeRange = {
    0: [LESS, 50],
    1: [51, 75],
    2: [76, 85],
    3: [86, 93],
    4: [94, MORE]
} as const;

export const WindRanges: MagnitudeRange = {
    0: [LESS, 8],
    1: [9, 16],
    2: [15, 21],
    3: [22, 27],
    4: [28, MORE]
} as const;

export const ChanceRanges: MagnitudeRange = {
    0: "--",
    1: "SChc", // Small Chance
    2: "Chc",  // Chance
    3: "Lkly", // Likely
    4: "Ocnl", // Occasionally (max chance)
};

export const RealFeelPreferences: RealFeelMin = {
    ExtremelyHotMin: 105,
    VeryHotMin: 95,
    HotMin: 90,
    WarmMin: 80,
    NiceMin: 65,
    CoolMin: 50,
    ColdMin: 25,
    VeryColdMin: 5 
    // Very Cold is below ColdMin
};

export const HEADER_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36';
export const HEADER_ACCEPT = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
