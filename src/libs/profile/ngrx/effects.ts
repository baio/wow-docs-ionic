/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { SecureStorageService } from '@app/secure-storage';
import { appStarted, Notification, NotificationsService } from '@app/shared';
import { YaAuthService } from '@app/social-auth';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, NEVER } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  switchMap,
  tap,
} from 'rxjs/operators';
import { ProfileConfig, SocialAuthProvider } from '../models';
import {
  profileRehydrate,
  profileRehydrateSuccess,
  profileSocialLogin,
  profileSocialLoginError,
  profileSocialLoginSuccess,
  profileSocialLogout,
  setProfileConfig,
} from './actions';

const SOCIAL_AUTH_PROVIDER_KEY = 'social_auth_provider';
const SOCIAL_AUTH_TOKEN_KEY = 'social_auth_token';
const PROFILE_CONFIG_KEY = 'profile_config';

@Injectable()
export class ProfileEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly yaAuthService: YaAuthService,
    private readonly secureStorageService: SecureStorageService,
    private readonly notificationsService: NotificationsService
  ) {}

  appStarted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appStarted),
      map(() => profileRehydrate())
    )
  );

  profileSocialLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(profileSocialLogin),
      switchMap(async ({ provider, continuation }) => {
        switch (provider) {
          case 'yandex':
            try {
              const token = await this.yaAuthService.login();
              return profileSocialLoginSuccess({
                socialAuthState: { token, provider },
                continuation,
              });
            } catch {
              return null;
            }
          default:
            return null;
        }
      }),
      filter((f) => !!f)
    )
  );

  profileSocialLoginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(profileSocialLoginSuccess),
      switchMap(async ({ socialAuthState, continuation }) => {
        await this.secureStorageService.setValue(
          SOCIAL_AUTH_PROVIDER_KEY,
          socialAuthState.provider
        );
        await this.secureStorageService.setValue(
          SOCIAL_AUTH_TOKEN_KEY,
          socialAuthState.token
        );
        this.notificationsService.notify(Notification.CloudAuthSuccess);
        if (continuation) {
          return continuation;
        } else {
          return null;
        }
      }),
      filter((f) => !!f)
    )
  );

  profileRehydrate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(profileRehydrate),
      switchMap(async () => {
        const provider = await this.secureStorageService.getValue(
          SOCIAL_AUTH_PROVIDER_KEY
        );
        const token = await this.secureStorageService.getValue(
          SOCIAL_AUTH_TOKEN_KEY
        );
        const config: ProfileConfig =
          await this.secureStorageService.getValueAsObject(PROFILE_CONFIG_KEY);
        const socialAuthState =
          provider && token
            ? { provider: provider as SocialAuthProvider, token }
            : null;
        return profileRehydrateSuccess({ socialAuthState, config });
      })
    )
  );

  profileSocialLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(profileSocialLogout),
        tap(async () => {
          await this.secureStorageService.removeValue(SOCIAL_AUTH_PROVIDER_KEY);
          await this.secureStorageService.removeValue(SOCIAL_AUTH_TOKEN_KEY);
        })
      ),
    {
      dispatch: false,
    }
  );

  setProfileConfig$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setProfileConfig),
        tap(async ({ config }) => {
          await this.secureStorageService.setValueAsObject(
            PROFILE_CONFIG_KEY,
            config
          );
        })
      ),
    {
      dispatch: false,
    }
  );
}
