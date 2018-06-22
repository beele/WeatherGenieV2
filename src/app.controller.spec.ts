import {Test, TestingModule} from '@nestjs/testing';
import {WeatherController} from './controllers/weather.controller';
import {BuienradarService} from './services/buienradar.service';

describe('WeatherController', () => {
    let app: TestingModule;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [WeatherController],
            providers: [BuienradarService],
        }).compile();
    });

    describe('root', () => {
        it('should return "Hello World!"', () => {
            const appController = app.get<WeatherController>(WeatherController);
            expect(appController.root()).toBe('Hello World!');
        });
    });
});
