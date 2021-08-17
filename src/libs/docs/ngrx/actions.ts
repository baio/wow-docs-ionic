import { createAction, props } from '@ngrx/store';
import { SocialAuthProvider, SocialAuthState } from 'src/libs/profile/models';
import { Doc, DocAttachment, DocFormatted, DocState } from '../models';

export const rehydrateDocs = createAction('[Docs] Rehydrate Docs');

export const rehydrateDocsSuccess = createAction(
  '[Docs] Rehydrate Docs Success',
  props<{ docs: Doc[]; attachments: DocAttachment[] }>()
);

export const addDocument = createAction(
  '[Docs] Add Doc',
  props<{ id: string; base64: string; date: number }>()
);

export const addDocSuccess = createAction(
  '[Docs] Add Doc Success',
  props<{ id: string }>()
);

export const addDocError = createAction('[Docs] Add Doc Error');

export const updateDocState = createAction(
  '[Docs] Update Doc State',
  props<{ id: string; docState: DocState }>()
);

export const displayDoc = createAction(
  '[Docs] Display Doc',
  props<{ id: string }>()
);

export const editDoc = createAction('[Docs] Edit Doc', props<{ id: string }>());

export const deleteDoc = createAction(
  '[Docs] Delete Doc',
  props<{ doc: Doc }>()
);

export const deleteDocConfirmed = createAction(
  '[Docs] Delete Doc Confirmed',
  props<{ doc: Doc; deleteFromCloud: boolean }>()
);

export const updateDocFormatted = createAction(
  '[Docs] Update Doc Formatted',
  props<{ id: string; docFormatted: DocFormatted }>()
);

export const shareDoc = createAction(
  '[Docs] Share Doc',
  props<{ doc: Doc; share: 'doc-only' | 'image-only' | 'doc-and-image' }>()
);

export const copyClipboard = createAction(
  '[Docs] Doc Copy Clipboard',
  props<{ doc: Doc }>()
);

export const showFullScreenImage = createAction(
  '[Docs] Show Full Screen Image',
  props<{ doc: Doc; attachmentIndex?: number }>()
);

export const addDocTag = createAction(
  '[Docs] Add Doc Tag',
  props<{ id: string; tag: string }>()
);

export const removeDocTag = createAction(
  '[Docs] Remove Doc Tag',
  props<{ id: string; tag: string }>()
);

export const setDocComment = createAction(
  '[Docs] Set Doc Comment',
  props<{ id: string; comment: string }>()
);

export const setDocCommentDebounced = createAction(
  '[Docs] Set Doc Comment Debounced',
  props<{ id: string; comment: string }>()
);

export const uploadCloudDoc = createAction(
  '[Docs] Upload Cloud Doc',
  props<{ doc: Doc; date: number }>()
);

export const addCloudDocConfirmed = createAction(
  '[Docs] Add Cloud Doc Confirmed',
  props<{ doc: Doc; socialAuthState: SocialAuthState; date: number }>()
);

export const updateCloudDocImageConfirmed = createAction(
  '[Docs] Update Cloud Doc Image Confirmed',
  props<{ doc: Doc; socialAuthState: SocialAuthState }>()
);

export const uploadCloudDocConfirmed = createAction(
  '[Docs] Upload Cloud Doc Confirmed',
  props<{ doc: Doc; date: number }>()
);

export const tryUploadCloudDocAutomatically = createAction(
  '[Docs] Try Upload Cloud Doc Automatically',
  props<{ doc: Doc; date: number }>()
);

export const uploadCloudDocSuccess = createAction(
  '[Docs] Upload Cloud Doc Success',
  props<{ doc: Doc; url: string; provider: SocialAuthProvider }>()
);

export const uploadCloudDocError = createAction(
  '[Docs] Upload Cloud Doc Error',
  props<{ doc: Doc; error: any }>()
);

export const removeCloudDoc = createAction(
  '[Docs] Remove Cloud Doc',
  props<{ doc: Doc }>()
);

export const removeCloudDocConfirmed = createAction(
  '[Docs] Remove Cloud Doc Confirmed',
  props<{ doc: Doc }>()
);

export const removeCloudDocSuccess = createAction(
  '[Docs] Remove Cloud Doc Success',
  props<{ id: string }>()
);

export const removeCloudDocError = createAction(
  '[Docs] Remove Cloud Doc Error',
  props<{ id: string; error: any }>()
);

export const updateDocImage = createAction(
  '[Docs] Update Doc Image',
  props<{ doc: Doc; base64: string }>()
);

export const addDocAttachment = createAction(
  '[Docs] Add Doc Attachment',
  props<{ doc: Doc; id: string; base64: string }>()
);

export const removeDocAttachment = createAction(
  '[Docs] Remove Doc Attachment',
  props<{ doc: Doc; attachmentIndex: number }>()
);

export const cloudDocImported = createAction(
  '[Docs] Cloud Doc Imported',
  props<{ doc: Doc; docAttachments: DocAttachment[] }>()
);

export const scanDoc = createAction(
  '[Docs] Scan Doc',
  props<{ id: string; base64: string }>()
);

export const queryFormattedDoc = createAction(
  '[Docs] Query Formatted Doc',
  props<{ id: string; startTime: number }>()
);

export const queryFormattedDocCancel = createAction(
  '[Docs] Query Formatted Doc Cancel'
);

export const queryFormattedDocSuccess = createAction(
  '[Docs] Query Formatted Doc Success',
  props<{ id: string; startTime: number; docFormatted: DocFormatted }>()
);

export const queryFormattedDocError = createAction(
  '[Docs] Query Formatted Doc Error',
  props<{ id: string; startTime: number }>()
);
