import { createReducer, on } from '@ngrx/store';
import { assoc, assocPath } from 'lodash/fp';
import { ProfileState } from '../models';
import {
  profileRehydrateSuccess,
  profileSocialLoginSuccess,
  profileSocialLogout,
  setProfileConfig,
} from './actions';

export const initialState: ProfileState = {
  socialAuthState: null,
  config: {
    uploadToCloudAutomatically: true,
    extractImageDataAutomatically: false,
  },
};

export const profileReducer = createReducer(
  initialState,
  on(profileSocialLoginSuccess, (state, { socialAuthState }) =>
    assoc('socialAuthState', socialAuthState, state)
  ),
  on(profileRehydrateSuccess, (state, { socialAuthState, config }) => {
    state = assoc('socialAuthState', socialAuthState, state);
    if (config) {
      state = assoc('config', config, state);
    }
    return state;
  }),
  on(profileSocialLogout, (state) =>
    assoc('socialAuthState', null as any, state)
  ),
  on(setProfileConfig, (state, { config }) =>
    assocPath(['config'], config, state)
  )
);
