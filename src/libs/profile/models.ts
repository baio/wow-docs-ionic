export type SocialAuthProvider = 'yandex';

export interface SocialAuthState {
  provider: SocialAuthProvider;
  token: string;
}

export interface ProfileConfig {
  uploadToCloudAutomatically: boolean;
  extractImageDataAutomatically: boolean;
}

export interface ProfileState {
  socialAuthState: SocialAuthState | null;
  config: ProfileConfig;
}
