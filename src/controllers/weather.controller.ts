import {Controller, Get, Param, Res} from '@nestjs/common';
import {BuienradarService} from '../services/buienradar.service';
import {BlitzortungService} from '../services/blitzortung.service';

@Controller('api')
export class WeatherController {

    constructor(private readonly buienradarService: BuienradarService, private blitzortungService: BlitzortungService) {

    }

    @Get('city/:name')
    locationId(@Param('name') name: string) {
        return this.buienradarService.findLocationId(name);
    }

    @Get('forecast/:id')
    forecast(@Param('id') id: number) {
        return this.buienradarService.getForecastedWeather(id);
    }

    @Get('forecast/rain/:lat/:lon')
    forecastRain(@Param('lat') lat: number, @Param('lon') lon: number) {
        return this.buienradarService.getRainPrediction3Hours(lat, lon);
    }

    @Get('lightning/:lat/:lon')
    lightning(@Param('lat') lat: number, @Param('lon') lon: number) {
        return this.blitzortungService.getLightningStrikesInArea(lat, lon);
    }

    @Get('lightning/')
    lightningLast100() {
        return this.blitzortungService.getLast100LighningStrikes();
    }
}
