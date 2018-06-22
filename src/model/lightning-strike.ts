import {Moment} from 'moment';

export class LightningStrike {

    lat: number;
    lon: number;
    timestamp: Moment;

    constructor(lat: number, lon: number, timestamp: Moment) {
        this.lat = lat;
        this.lon = lon;
        this.timestamp = timestamp;
    }
}