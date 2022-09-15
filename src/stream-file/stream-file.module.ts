import { Module } from '@nestjs/common';
import { StreamFileController } from './stream-file.controller';
import { StreamFileService } from './stream-file.service';

@Module({
  controllers: [StreamFileController],
  providers: [StreamFileService]
})
export class StreamFileModule {}
