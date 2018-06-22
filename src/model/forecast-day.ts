import {Moment} from 'moment';
import {ForecastBase} from './forecast-base';
import {ForecastHour} from './forecast-hour';

export class ForecastDay extends ForecastBase {

    sunrise: Moment;
    sunset: Moment;

    minTemp: number;
    maxTemp: number;

    hours: ForecastHour[];

    constructor(date: Moment, sunrise: Moment, sunset: Moment,
                temp: number, feelTemp: number, minTemp: number, maxTemp: number,
                condition: string,
                windSpeed: number, windBeaufort: number, windDirection: string,
                precipitation: number, uvIndex: number,
                hours: ForecastHour[]) {

        super(
            date,
            temp, feelTemp,
            condition,
            windSpeed, windBeaufort, windDirection,
            precipitation, uvIndex,
        );

        this.sunrise = sunrise;
        this.sunset = sunset;

        this.minTemp = minTemp;
        this.maxTemp = maxTemp;

        this.hours = hours;
    }
}