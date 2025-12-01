import { Domain } from "domain";
import { Candidate, ChanceForeast, HourlyNumbers, DomainModel, Hour, UnknownNumber, CHANCE_FORECAST } from "../types";
import { candidateToType, isNumber, isPositive, isNotNegative, isString, isWithin } from "../utility";

type Fahrenheit = number;
type Percent = number;
type AirMilesPerHour = number;

// !! unknown number should be updated here
export interface ThreeHourWeatherOutputModel {
    temperature: Fahrenheit,
    skyCover: Percent,
    wind: AirMilesPerHour,
    humidity: Percent,
    precipChance: Percent,
    rain: ChanceForeast,
    snow: ChanceForeast,
    thunder: ChanceForeast,
    hour: Hour  // use a range comparison something fancy like IntRange<>
};


export const ThreeHourWeatherModel: DomainModel<ThreeHourWeatherModel> = {
    formModelFromCandidate(candidate: Candidate<ThreeHourWeatherModel>): ThreeHourWeatherModel {
        return {
            temperature: formFahrenheit(candidate.temperature),
            skyCover: formPercent(candidate.skyCover),
            wind: formAirMilesPerHour(candidate.wind),
            humidity: formPercent(candidate.humidity),
            precipChance: formPercent(candidate.precipChance),
            rain: formChanceForecast(candidate.rain),
            snow: formChanceForecast(candidate.snow),
            thunder: formChanceForecast(candidate.thunder),
            hour: formHour(candidate.hour)
       ,
     };


        function formChanceForecast(candidate: unknown): ChanceForeast {
            return candidateToType<ChanceForeast>(candidate, [isString, isChanceForecastValue]);

        }

        function formFahrenheit(candidate: unknown): Fahrenheit {
            return candidateToType<Fahrenheit>(candidate, [isNumber, isAboveAbsoluteZero, isBelowBoiling]);
        }

        function formPercent(candidate: unknown): Percent {
            return candidateToType<Percent>(candidate, [isNumber, isNotNegative, isNoMoreThan100]);
        }

        function formAirMilesPerHour(candidate: unknown): AirMilesPerHour {
            return candidateToType<AirMilesPerHour>(candidate, [isNumber, isNotNegative, isBelowSpeedOfSound]);
        }

        function formHour(candidate: unknown): Hour {
            return candidateToType<Hour>(candidate, [isNumber, isNotNegative, is24OrLess]);
        }

        function isChanceForecastValue(candidate: unknown) {
            return CHANCE_FORECAST.includes(String(candidate) as any);
        }

        function isAboveAbsoluteZero(input: unknown) {
            return Number(input) > -274;
        }

        function is24OrLess(input: unknown) {
            return Number(input) <= 24;
        }

        function isBelowBoiling(input: unknown) {
            return Number(input) < 212;
        }

        function isNoMoreThan100(input: unknown) {
            return Number(input) <= 100;
        }

        function isBelowSpeedOfSound(input: unknown) {
            return Number(input) < 767;
        }

    },



}
/*
class ThreeHourWeather implements DomainModel<ThreeHourWeatherModel> {
    formModelFromCandidate(candidate: Candidate<ThreeHourWeatherModel>): ThreeHourWeatherModel {
        
    }


} 
    */