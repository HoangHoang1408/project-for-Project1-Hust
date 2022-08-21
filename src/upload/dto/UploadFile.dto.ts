import { IsString } from 'class-validator';

export class UploadInput {
  @IsString()
  storagePath: string;
}
