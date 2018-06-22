import {Moment} from 'moment';

export class ForecastRain {

    timestamp: Moment;
    precipitation: number;

    constructor(timestamp: Moment, precipitation: number) {
        this.timestamp = timestamp;
        this.precipitation = precipitation;
    }
}