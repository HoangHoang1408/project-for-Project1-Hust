import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('download')
export class StreamFileController {
  @Get(':filename')
  getStaticFile(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ): StreamableFile {
    const file = createReadStream(
      join(process.cwd(), `src/files/${filename}.docx`),
    );
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}.docx`,
    });
    return new StreamableFile(file);
  }
}
