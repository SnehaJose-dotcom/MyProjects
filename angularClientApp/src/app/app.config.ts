import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; 
import { HomeComponent } from './pages/home/home.component';
import { ApiDataComponent } from './pages/api-data/api-data.component';
import { FormPageComponent } from './pages/form-page/form-page.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: '', component: HomeComponent },
      { path: 'api-data', component: ApiDataComponent },
      { path: 'form', component: FormPageComponent },
    ]),
    provideHttpClient(), 
  ],
};
