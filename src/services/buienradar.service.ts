import {HttpService, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs/internal/Observable';
import {AxiosResponse} from '@nestjs/common/http/interfaces/axios.interfaces';
import {City} from '../model/city';
import {map} from 'rxjs/operators';
import {Forecast} from '../model/forecast';
import * as moment from 'moment';
import {ForecastHour} from '../model/forecast-hour';
import {ForecastDay} from '../model/forecast-day';
import {ForecastRain} from '../model/forecast-rain';

@Injectable()
export class BuienradarService {

    constructor(private readonly httpService: HttpService) {

    }

    findLocationId(city: string): Observable<City[]> {
        const uri = 'https://api.buienradar.nl/data/search/1.0/?query=' + city + '&country=BE&locale=nl-BE';
        const result$: Observable<AxiosResponse> = this.httpService.get(uri);

        return Observable.create((obs) => {
            const cities: City[] = [];
            result$.subscribe((data: AxiosResponse) => {
                    const dataIndex: number = data.data.length > 1 ? (data.data.length - 1) : 0;
                    if (data.data.length > 0) {
                        for (const singleCity of data.data[dataIndex].results) {
                            const uriPieces: string[] = singleCity.uri.split('/');
                            cities.push(new City(Number(uriPieces[uriPieces.length - 1]), singleCity.main, singleCity.sub));
                        }
                    }
                }, (error) => {
                    console.log(error);
                },
                () => {
                    obs.next(cities);
                    obs.complete();
                });
        });
    }

    getForecastedWeather(id: number): Observable<Forecast> {
        const result$ = this.httpService.get('https://api.buienradar.nl/data/forecast/1.1/all/' + id);

        return result$.pipe(map((data: AxiosResponse) => {

            const days: ForecastDay[] = [];
            for (const forecastedDay of data.data.days) {

                const hours: ForecastHour[] = [];
                if (forecastedDay.hours && forecastedDay.hours.length > 0) {
                    for (const forecastedHour of forecastedDay.hours) {
                        hours.push(
                            new ForecastHour(
                                // Times are in UTC!
                                moment(forecastedHour.date),
                                forecastedHour.temperature, forecastedHour.feeltemperature,
                                forecastedHour.iconcode, this.convertForecastIconCodeToWeatherCondition(forecastedHour.iconcode),
                                forecastedHour.windspeed, forecastedHour.beaufort, forecastedHour.winddirection,
                                forecastedHour.humidity, forecastedHour.precipitation, forecastedHour.precipitationmm,
                                forecastedHour.uvindex, forecastedHour.sunshine, forecastedHour.sunpower,
                            ),
                        );
                    }
                }

                days.push(
                    new ForecastDay(
                        // Times are in UTC!
                        moment(forecastedDay.date),
                        moment(forecastedDay.sunrise), moment(forecastedDay.sunset),
                        forecastedDay.temperature, forecastedDay.feeltemperature, forecastedDay.mintemp, forecastedDay.maxtemp,
                        forecastedDay.iconcode, this.convertForecastIconCodeToWeatherCondition(forecastedDay.iconcode),
                        forecastedDay.windspeed, forecastedDay.beaufort, forecastedDay.winddirection,
                        forecastedDay.precipitation, forecastedDay.uvindex,
                        hours,
                    ),
                );
            }

            return new Forecast(data.data.location.lat, data.data.location.lon, data.data.altitude, data.data.elevation, days);
        }));
    }

    getRainPrediction3Hours(lat: number, lon: number): Observable<ForecastRain[]> {
        const result$ = this.httpService.get('https://graphdata.buienradar.nl/forecast/json/?lat=' + lat + '&lon=' + lon);

        return result$.pipe(map((data: AxiosResponse) => {
            const rainForecasts: ForecastRain[] = [];

            if (data.data && data.data.forecasts) {
                for (const forecast of data.data.forecasts) {
                    rainForecasts.push(new ForecastRain(moment(forecast.utcdatetime), forecast.precipitation));
                }
            }
            return rainForecasts;
        }));
    }

    private convertForecastIconCodeToWeatherCondition(iconCode: string): string {
        switch (iconCode) {
            case 'a':
                return 'zonnig';
            case 'b':
                return 'plaatselijk bewolkt';
            case 'c':
                return 'bewolkt';
            case 'd':
                return 'plaatselijk bewolkt met mist';
            case 'f':
                return 'lichte buien';
            case 'g':
                return 'plaatselijk onweer';
            case 'h':
                return 'buien';
            case 'i':
                return 'nachtelijke sneeuwbuien';
            case 'j':
                return 'licht bewolkt';
            case 'k':
                return 'lichte buien';
            case 'l':
                return 'regen';
            case 'm':
                return 'lichte regen';
            case 'n':
                return 'mistig';
            case 'o':
                return 'licht bewolkt';
            case 'p':
                return 'bewolkt';
            case 'q':
                return 'regen';
            case 'r':
                return 'overwegend bewolkt';
            case 's':
                return 'onweer';
            case 't':
                return 'sneeuw';
            case 'v':
                return 'lichte sneeuw';
            case 'w':
                return 'smeltende sneeuw';
        }
    }
}
