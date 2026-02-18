import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { DataService } from './data.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()), // TRÈS IMPORTANT
    importProvidersFrom(
      HttpClientInMemoryWebApiModule.forRoot(DataService, {
        dataEncapsulation: false,
        delay: 0,
      }),
    ),
  ],
};
