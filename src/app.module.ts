import {HttpModule, Module} from '@nestjs/common';
import {WeatherController} from './controllers/weather.controller';
import {BuienradarService} from './services/buienradar.service';
import {BlitzortungService} from './services/blitzortung.service';
import {FileController} from './controllers/file.controller';

@Module({
    imports: [HttpModule],
    controllers: [FileController, WeatherController],
    providers: [BuienradarService, BlitzortungService],
})
export class AppModule {

}
