import { Body, Controller, Post } from '@nestjs/common';
import { ImportBookSchema, type ImportBookBody } from './import.schema';
import { ImportService } from './import.service';

@Controller('import')
export class ImportController {
    constructor(private readonly importService: ImportService) { }

    @Post()
    async importBook(@Body() rawBody: unknown) {
        const parsedBody = ImportBookSchema.parse(rawBody);
        return this.importService.importBook(parsedBody);
    }
}
