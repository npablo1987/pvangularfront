import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { routes } from './app/app.routes';

// Agregar HttpClientModule a los providers dentro de appConfig
const updatedAppConfig = {
  ...appConfig,
  providers: [...(appConfig.providers || []), importProvidersFrom(HttpClientModule)],
};

bootstrapApplication(AppComponent, updatedAppConfig)
  .catch((err) => console.error(err));