
export const WIND_SPEED = ["", "W", "WW", "WWW", "WWW+"] as const;
export const HUMIDITY = ["", "H", "HH", "HHH", "HHH+"] as const;
export const THUNDER = ["", "T", "TT", "TTT", "TTT+"] as const;
export const CHANCE_FORECAST = ["--", "SChc", "Chc", "Lkly", "Ocnl"] as const;

export type WindSpeed = typeof WIND_SPEED[number];
export type Humidity = typeof HUMIDITY[number];
export type Thunder = typeof THUNDER[number];
export type ChanceForeast = typeof CHANCE_FORECAST[number];

// 4 is represented as "more than 3: 3+"
export type Magnitude = 0 | 1 | 2 | 3 | 4;
export type Postfix = WindSpeed | Humidity | Thunder;
export type PostfixLetter = "W" | "H" | "T"

export type MagnitudeRange = {
    [key in Magnitude]: number[] | ChanceForeast
}

export type RealFeelMin = {
    VeryHotMin: number,
    HotMin: number,
    WarmMin: number,
    NiceMin: number,
    CoolMin: number,
    ColdMin: number 
}

export {}