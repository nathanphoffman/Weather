import { Domain } from "domain";
import { Candidate, ChanceForeast, HourlyNumbers, DomainModel, Hour, UnknownNumber } from "../types";

// !! unknown number should be updated here
export interface ThreeHourWeatherModel {
    temperature: UnknownNumber, 
    skyCover: UnknownNumber, 
    wind: UnknownNumber, 
    humidity: UnknownNumber, 
    precipChance: UnknownNumber, 
    rain: ChanceForeast, 
    snow: ChanceForeast, 
    thunder: ChanceForeast, 
    hour: Hour
};


export const ThreeHourWeatherModel: DomainModel<ThreeHourWeatherModel> = {
        formModelFromCandidate(candidate: Candidate<ThreeHourWeatherModel>): ThreeHourWeatherModel {
            return undefined;
        }
/*
        formMagnitudes(arr: string[]) {
            // rain thunder snow
            // map((x)=>convertNOAAChancesToAverageMagnitude(x))
            arrayNotEmpty(arr);
        }
            */
};

/*
class ThreeHourWeather implements DomainModel<ThreeHourWeatherModel> {
    formModelFromCandidate(candidate: Candidate<ThreeHourWeatherModel>): ThreeHourWeatherModel {
        
    }


} 
    */  