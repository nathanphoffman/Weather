import { MagnitudeRange, RealFeelMin, StormMin } from "./types";

export const latLon = {
    default: [40.1852, -75.538], //royersford
    ny: [40.7198, -73.993], //nyc
    p: [39.99310, -74.78790], //philly
    cabin: [41.39127,-76.75871]
};

export function getChosenLocation() {
    const argument = (process.argv as any[])?.[2];
    const chosenLocation = !argument ? "default" : argument;
    return String(chosenLocation);
}

export function getLat() {
    const chosenLocation = getChosenLocation();
    const chosenLatLon = latLon[chosenLocation];
    return chosenLatLon[0];
}

export function getLon() {
    const chosenLocation = getChosenLocation();
    const chosenLatLon = latLon[chosenLocation];
    return chosenLatLon[1];
}


export function getLatLon() {
    const chosenLocation = getChosenLocation();
    const chosenLatLon = latLon[chosenLocation];
    const queryString = `lat=${chosenLatLon[0]}&lon=${chosenLatLon[1]}`;
    return queryString;
}

const LESS = -1, MORE = -1;

export const HumidityRanges: MagnitudeRange = {
    0: [LESS, 45],
    1: [46, 75],
    2: [76, 85],
    3: [86, 93],
    4: [94, MORE]
} as const;

export const WindRanges: MagnitudeRange = {
    0: [LESS, 9],
    1: [10, 17],
    2: [18, 24],
    3: [25, 31],
    4: [32, MORE]
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
    // Extremely Cold (bright red) is below ColdMin
};

export const StormPreferences: StormMin = {
    VeryBadMin: 50,
    BadMin: 30,
    PoorMin: 10,
    AverageMin: 5
    // Good (green) is better than (or below) AverageMin "storm level"
};

export const HEADER_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36';
export const HEADER_ACCEPT = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
