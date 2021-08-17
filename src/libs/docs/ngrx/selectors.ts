import { createFeatureSelector, createSelector } from '@ngrx/store';
import { orderBy } from 'lodash/fp';
import { DocsState } from '../models';

export const selectDocsState = createFeatureSelector<DocsState>('docs');

export const selectDocs = createSelector(
  selectDocsState,
  (state) => state.docs
);

export const selectAttachments = createSelector(
  selectDocsState,
  (state) => state.attachments
);

export const selectDoc = (id: string) =>
  createSelector(selectDocs, (docs) => docs[id]);

export const selectDocsAsSortedList = createSelector(selectDocs, (docs) =>
  orderBy((a) => new Date(a.date), 'desc', Object.values(docs))
);

export const selectDocWithAttachments = (id: string) =>
  createSelector(selectDoc(id), selectAttachments, (doc, attachments) => {
    if (!doc) {
      return null;
    } else {
      const docAttachments = doc.attachments || [];
      const docAttachmentResults = docAttachments.map((m) => attachments[m]);
      return {
        doc,
        attachments: docAttachmentResults,
      };
    }
  });
