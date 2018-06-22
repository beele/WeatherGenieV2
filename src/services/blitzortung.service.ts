import {Injectable} from '@nestjs/common';
import * as WebSocket from 'ws';
import {from, Observable} from 'rxjs';
import {LightningStrike} from '../model/lightning-strike';
import * as moment from 'moment';
import {filter, toArray} from 'rxjs/operators';

@Injectable()
export class BlitzortungService {

    private maxStrikeSize: number = 10000;
    // Newest strikes are first in the array!
    private strikes: LightningStrike[];

    private boundary: string = '{"west":-12,"east":20,"north":56,"south":33.6}';
    private ws;

    constructor() {
        this.strikes = [];
        this.setupWebSocket();
    }

    private setupWebSocket() {
        this.ws = new WebSocket('ws://ws.blitzortung.org:8058/');
        this.ws.addEventListener('error', (err) => console.log(err.message));

        this.ws.on('open', () => {
            console.log('Sending request for lightning data');
            this.ws.send(this.boundary, (error) => {
                if (error) {
                    // TODO: Retry websocket connection!
                } else {
                    console.log('Websocket message sent!');
                }
            });
        });

        this.ws.on('message', (data) => {
            const json = JSON.parse(data);

            // Timestamps are in UTC!
            if (json.sig && json.sig.length > 0) {
                for (const item of json.sig) {
                    this.checkAndAddToStrikes(item.lat, item.lon, json.time + item.time);
                }
            } else {
                this.checkAndAddToStrikes(json.lat, json.lon, json.time);
            }
        });
    }

    private checkAndAddToStrikes(lat: number, lon: number, time: number) {
        if (this.strikes.length === this.maxStrikeSize) {
            this.strikes.pop();
        }
        this.strikes.unshift(new LightningStrike(lat, lon, moment(Math.floor((time) / 1000000))));
    }

    getLightningStrikesInArea(lat: number, lon: number): Observable<LightningStrike[]> {
        return from(this.strikes).pipe(
            filter((strike: LightningStrike) => {
                return this.getDistanceBetweenTwoLatLonPoints(lat, lon, strike.lat, strike.lon) < 5;
            }), toArray(),
        );
    }

    getLast100LighningStrikes(): Observable<LightningStrike[]> {
        return from(this.strikes.slice(0, 100)).pipe(toArray());
    }

    private getDistanceBetweenTwoLatLonPoints(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R: number = 6371;
        const dLat: number = this.deg2rad(lat2 - lat1);
        const dLon: number = this.deg2rad(lon2 - lon1);
        const a: number =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }
}