import {ForecastDay} from './forecast-day';

export class Forecast {

    lat: number;
    lon: number;
    altitude: number;
    elevation: number;

    days: ForecastDay[];

    constructor(lat: number, lon: number, altitude: number, elevation: number, days: ForecastDay[]) {
        this.lat = lat;
        this.lon = lon;
        this.altitude = altitude;
        this.elevation = elevation;
        this.days = days;
    }
}