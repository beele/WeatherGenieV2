import {Moment} from 'moment';

export abstract class ForecastBase {

    date: Moment;

    temp: number;
    feelTemp: number;

    condition: string;

    windSpeed: number;
    windBeaufort: number;
    windDirection: string;

    precipitation: number;
    uvIndex: number;

    constructor(date: Moment,
                temp: number, feelTemp: number,
                condition: string,
                windSpeed: number, windBeaufort: number, windDirection: string,
                precipitation: number, uvIndex: number) {

        this.date = date;
        this.temp = temp;
        this.feelTemp = feelTemp;
        this.condition = condition;
        this.windSpeed = windSpeed;
        this.windBeaufort = windBeaufort;
        this.windDirection = windDirection;
        this.precipitation = precipitation;
        this.uvIndex = uvIndex;
    }
}