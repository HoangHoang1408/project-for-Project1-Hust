import { DynamicModule, Module } from '@nestjs/common';
import {
  EmailConfigOptions,
  EMAIL_CONFIG_OPTIONS,
} from './constants/constants';
import { EmailService } from './email.service';
@Module({})
export class EmailModule {
  static forRoot(options: EmailConfigOptions): DynamicModule {
    return {
      module: EmailModule,
      global: true,
      providers: [
        {
          provide: EMAIL_CONFIG_OPTIONS,
          useValue: options,
        },
        EmailService,
      ],
      exports: [EmailService],
    };
  }
}
