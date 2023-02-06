import { Component } from '@angular/core';
import { AuthService } from '@app/auth';
import { DbService, SqLiteService } from '@app/db';
import { SecureStorageService } from '@app/secure-storage';
import { appStarted } from '@app/shared';
import { YaAuthService } from '@app/social-auth';
import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';
import { v4 } from 'uuid';

const DEVICE_ID_STORAGE_KEY = 'DEVICE_ID';

export const getDeviceId = async (secureStorage: SecureStorageService) => {
  let deviceId = await secureStorage.getValue(DEVICE_ID_STORAGE_KEY);
  if (!deviceId) {
    deviceId = v4();
  }
  await secureStorage.setValue(DEVICE_ID_STORAGE_KEY, deviceId);
  return deviceId;
};

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  isWeb = true;

  constructor(
    private readonly sqLiteService: SqLiteService,
    private readonly platform: Platform,
    private readonly store: Store,
    private readonly authService: AuthService,
    private readonly db: DbService,
    private readonly yaAuthService: YaAuthService,
    private readonly secureStorageService: SecureStorageService
  ) {
    this.initializeApp();
  }

  private async initializeApp() {
    await this.platform.ready();
    await this.initializeSqlite();
    await this.initializeAuth();
    await this.initializeDb();
    this.store.dispatch(appStarted());
  }

  private async initializeSqlite() {
    const ret = await this.sqLiteService.initializePlugin();
    console.log('$$$ in App  this.initPlugin ', ret);

    if (this.sqLiteService.platform === 'web') {
      this.isWeb = true;
      await customElements.whenDefined('jeep-sqlite');
      const jeepSqliteEl = document.querySelector('jeep-sqlite');
      if (jeepSqliteEl != null) {
        console.log(`>>>> isStoreOpen ${await jeepSqliteEl.isStoreOpen()}`);
      } else {
        console.log('>>>> jeepSqliteEl is null');
      }
      await this.sqLiteService.initWebStore();
    }

    const res = await this.sqLiteService.echo('Hello World');
    console.log('$$$ from Echo ' + res.value);
  }

  private async initializeAuth() {
    const deviceId = await getDeviceId(this.secureStorageService);
    this.yaAuthService.setDeviceId(deviceId);
    console.log('!!! device id set ', deviceId);
    await this.authService.isAuthenticated$
      .pipe(
        filter((f) => !!f),
        take(1)
      )
      .toPromise();
  }

  private async initializeDb() {
    const securityKey = await this.authService.getSecurityKey();
    await this.db.init(securityKey);
  }
}
