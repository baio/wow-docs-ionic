import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProfileState } from '../models';

export const selectProfileState =
  createFeatureSelector<ProfileState>('profile');

export const selectSocialAuthState = createSelector(
  selectProfileState,
  (state) => state.socialAuthState
);

export const selectProfileConfig = createSelector(
  selectProfileState,
  (state) => state.config
);
