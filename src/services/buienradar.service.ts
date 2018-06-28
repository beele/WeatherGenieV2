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
                return 'Sunny';
            case 'b':
                return 'Partly cloudy';
            case 'c':
                return 'Cloudy';
            case 'd':
                return 'Partly cloudy with fog';
            case 'f':
                return 'Light showers';
            case 'g':
                return 'Local thunderstorms';
            case 'h':
                return 'Showers';
            case 'i':
                return 'Nightly snow';
            case 'j':
                return 'Mostly sunny';
            case 'k':
                return 'Light showers';
            case 'l':
                return 'Rain';
            case 'm':
                return 'Light rain';
            case 'n':
                return 'Foggy';
            case 'o':
                return 'Mostly sunny';
            case 'p':
                return 'Cloudy';
            case 'q':
                return 'Rain';
            case 'r':
                return 'Mostly cloudy';
            case 's':
                return 'Thunderstorms';
            case 't':
                return 'Snow';
            case 'v':
                return 'Light snow';
            case 'w':
                return 'Melting snow';
        }
    }
}
