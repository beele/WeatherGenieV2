import {Controller, Get, Res} from '@nestjs/common';
import * as path from 'path';

@Controller()
export class FileController {

    @Get()
    root(@Res() res) {
        res.sendFile(path.join(__dirname, '../../www', 'weather.html'), (err) => {
            console.log(err);
        });
    }
}