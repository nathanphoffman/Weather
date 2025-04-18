import { MagnitudeRange, RealFeelMin } from "./types";

export const lat = 40.1852
export const lon =- 75.538

const LESS = -1, MORE = -1;

export const HumidityRanges: MagnitudeRange = {
    0: [LESS, 55],
    1: [56, 75],
    2: [76, 85],
    3: [86, 93],
    4: [94, MORE]
} as const;

export const WindRanges: MagnitudeRange = {
    0: [LESS, 13],
    1: [14, 19],
    2: [20, 29],
    3: [30, 39],
    4: [40, MORE]
} as const;

export const ChanceRanges: MagnitudeRange = {
    0: "--",
    1: "SChc", // Small Chance
    2: "Chc",  // Chance
    3: "Lkly", // Likely
    4: "Ocnl", // Occasionally (max chance)
};

export const RealFeelPreferences: RealFeelMin = {
    VeryHotMin: 100,
    HotMin: 90,
    WarmMin: 80,
    NiceMin: 65,
    CoolMin: 50,
    ColdMin: 25
};

export const HEADER_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36';
export const HEADER_ACCEPT = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
