import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadInput } from './dto/UploadFile.dto';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() { storagePath }: UploadInput,
  ) {
    return this.uploadService.uploadFile(file, storagePath);
  }

  @Post('files')
  @UseInterceptors(FilesInterceptor('files'))
  @HttpCode(201)
  uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() { storagePath }: UploadInput,
  ) {
    return this.uploadService.uploadFiles(files, storagePath);
  }
}
