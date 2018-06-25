import {Moment} from 'moment';
import {ForecastBase} from './forecast-base';

export class ForecastHour extends ForecastBase {

    humidity: number;
    precipitationActual: number;
    sunshine: number;
    sunpower: number;

    constructor(date: Moment,
                temp: number, feelTemp: number,
                conditionCode: string, conditionText: string,
                windSpeed: number, windBeaufort: number, windDirection: string,
                humidity: number, precipitation: number, precipitationActual: number,
                uvIndex: number, sunshine: number, sunpower: number) {

        super(
            date,
            temp, feelTemp,
            conditionCode, conditionText,
            windSpeed, windBeaufort, windDirection,
            precipitation, uvIndex,
        );

        this.humidity = humidity;
        this.precipitationActual = precipitationActual;
        this.sunshine = sunshine;
        this.sunpower = sunpower;
    }
}