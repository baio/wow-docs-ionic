import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DbModule } from '@app/db';
import { YaAuthService, YA_AUTH_CONFIG } from '@app/social-auth';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeLogger } from 'ngrx-store-logger';
import { SecureStorageService } from 'src/libs/secure-storage/secure-storage.service';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TabsPageModule } from './tabs/tabs.module';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function logger(reducer: ActionReducer<any>): any {
  // default, no options
  return storeLogger()(reducer);
}

export const metaReducers = environment.production ? [] : [logger];

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    StoreModule.forRoot({}, { metaReducers }),
    StoreDevtoolsModule.instrument(),
    IonicModule.forRoot(),
    EffectsModule.forRoot(),
    TabsPageModule,
    DbModule,
  ],
  providers: [
    {
      provide: YA_AUTH_CONFIG,
      useValue: {
        ...environment.social.yandex,
        deviceId: null,
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
