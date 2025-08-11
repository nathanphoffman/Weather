import { MagnitudeRange, RealFeelMin, StormMin } from "./types";

export const latLon = {
    default: [40.1852, -75.538], //royersford
    ny: [40.7198, -73.993], //nyc
    p: [39.99310, -74.78790], //philly
    cabin: [41.39127,-76.75871],
    h: [40.2761,-76.8845], //harrisburg
    j: [39.6794, -78.5220]
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
    0: [LESS, 47],
    1: [48, 59],
    2: [60, 76],
    3: [77, 93],
    4: [94, MORE]
} as const;

export const WindRanges: MagnitudeRange = {
    0: [LESS, 9],
    1: [10, 15],
    2: [16, 22],
    3: [23, 29],
    4: [30, MORE]
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
    VeryHotMin: 100,
    HotMin: 90,
    WarmMin: 85,
    NiceMin: 65,
    CoolMin: 45,
    ColdMin: 30,
    VeryColdMin: 5 
    // Extremely Cold (bright red) is below ColdMin
};

export const StormPreferences: StormMin = {
    VeryBadMin: 50,
    BadMin: 30,
    PoorMin: 20,
    AverageMin: 8
    // Good (green) is better than (or below) AverageMin "storm level"
};

export const HEADER_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36';
export const HEADER_ACCEPT = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
