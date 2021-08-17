import { SocialAuthProvider } from 'src/libs/profile/models';
import { Doc, DocFormatted } from '../../models';
import { DocMeta } from './doc-meta';
import { formatEmptyCloudText, parseEmptyCloudText } from './empty-cloud-text';
import {
  formatPassportRFCloudText,
  parsePassportRFCloudText,
} from './passport-rf-cloud-text';
import {
  formatUnknownCloudText,
  parseUnknownCloudText,
} from './unknown-cloud-text';

const VERSION = '1';

export const formatCloudText = (doc: Doc) => {
  const meta = {
    tags: doc.tags,
    date: doc.date,
    comment: doc.comment,
    attachments: doc.attachments,
  } as DocMeta;
  const formatted = doc.formatted || null;
  const json = {
    version: VERSION,
    meta,
    formatted,
  };
  return JSON.stringify(json);
  /*
  if (doc.formatted) {
    switch (doc.formatted.kind) {
      case 'passport-rf':
        return formatPassportRFCloudText(doc.formatted, meta);
      case 'unknown':
        return formatUnknownCloudText(doc.formatted, meta);
      default:
        return formatEmptyCloudText(meta);
    }
  } else {
    return formatEmptyCloudText(meta);
  }
  */
};

export const parseCloudText = (
  id: string,
  provider: SocialAuthProvider,
  text: string,
  imgBase64: string,
  viewUrl: string
): Doc => {
  if (!text) {
    return null;
  }
  const data: { meta: DocMeta; formatted: DocFormatted } = JSON.parse(text);
  /*
  let data: { docFormatted: DocFormatted; docMeta: DocMeta } =
    parsePassportRFCloudText(text);
  if (!data) {
    data = parseUnknownCloudText(text);
  }
  if (!data) {
    data = parseEmptyCloudText(text);
  }
  */
  return {
    id,
    imgBase64,
    date: data.meta.date,
    tags: data.meta.tags,
    comment: data.meta.comment,
    attachments: data.meta.attachments,
    stored: {
      provider,
      url: viewUrl,
      status: 'success',
      date: data.meta.date,
    },
    labeled: data.formatted ? { label: data.formatted.kind } : null,
    formatted: data.formatted,
  };
};
