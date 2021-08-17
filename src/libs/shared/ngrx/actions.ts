import { createAction } from '@ngrx/store';

export const appStarted = createAction('[App] Started');

export const appDownloadDocsFromCloud = createAction(
  '[App] Download Docs From Cloud'
);
