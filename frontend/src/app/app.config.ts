// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
// REMOVIDO: import { provideRouter } from '@angular/router'; // Não precisamos de roteador
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideHttpClient(withFetch()) 
  ]
};