import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { GALLERY_CONFIG, GalleryConfig } from 'ng-gallery';
import { NgxSpinnerModule } from 'ngx-spinner';
import { loadingInterceptor } from './interceptos/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
     provideHttpClient(withInterceptors([jwtInterceptor,loadingInterceptor])),
      provideAnimations(),
      provideToastr({
    positionClass:'toast-bottom-left'
  }),
  importProvidersFrom(NgxSpinnerModule)
],
};
