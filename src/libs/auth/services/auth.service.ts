import { Injectable } from '@angular/core';
import { SecureStorageService } from '@app/secure-storage';
import { NativeBiometric } from 'capacitor-native-biometric';
import { BehaviorSubject } from 'rxjs';
import { v4 } from 'uuid';

const SECURITY_KEY = 'VOW_DOCS_SECURITY_KEY';
const PIN_KEY = 'VOW_DOCS_PIN_KEY';

@Injectable()
export class AuthService {
  readonly isAuthenticated$ = new BehaviorSubject(false);

  constructor(private readonly secureStorageService: SecureStorageService) {}

  async isBiometricAvailable() {
    try {
      const result = await NativeBiometric.isAvailable();
      return result.isAvailable;
    } catch {
      return false;
    }
  }

  getPin() {
    return this.secureStorageService.getValue(PIN_KEY);
  }

  getSecurityKey() {
    return this.secureStorageService.getValue(SECURITY_KEY);
  }

  async authenticateBiometric(setFirstTimeCredentials: boolean) {
    const isAvailable = await this.isBiometricAvailable();
    if (isAvailable) {
      try {
        // Authenticate using biometrics before logging the user in
        await NativeBiometric.verifyIdentity({
          reason: 'Безопасный вход',
          title: 'Для использования приложения необходимо авторизоваться',
          subtitle: 'Данные авторизации будут проверены устройством',
        });
        if (setFirstTimeCredentials) {
          await this.setSecurityKey();
        }
        return true;
      } catch (err) {
        return false;
      }
    } else {
      console.warn('NativeBiometric is not available !!!');
      return false;
    }
  }

  async setPin(pin: string, setFirstTimeCredentials: boolean) {
    await this.secureStorageService.setValue(PIN_KEY, pin);
    if (setFirstTimeCredentials) {
      await this.setSecurityKey();
    }
  }

  private async setSecurityKey() {
    const securityKey = await this.getSecurityKey();
    if (!securityKey) {
      const newSecurityKey = v4();
      await this.secureStorageService.setValue(SECURITY_KEY, newSecurityKey);
    }
  }

  setAuthenticated() {
    this.isAuthenticated$.next(true);
  }

  get isAuthenticated() {
    return this.isAuthenticated$.value;
  }
}
