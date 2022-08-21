import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class UploadService {
  constructor(private readonly firebaseService: FirebaseService) {}
  uploadFile(file: Express.Multer.File, storagePath: string) {
    return this.firebaseService.uploadFile(file, storagePath);
  }
  uploadFiles(files: Express.Multer.File[], storagePath: string) {
    return this.firebaseService.uploadFiles(files, storagePath);
  }
}
