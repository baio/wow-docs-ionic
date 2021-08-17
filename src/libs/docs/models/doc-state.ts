import { DocFormatted } from './doc-formatted';

export type DocStoredStatus = 'progress' | 'success' | 'error';

export interface DocStored {
  provider: 'yandex';
  url: string;
  status: DocStoredStatus;
  date: number;
}

export type DocLabel =
  | 'passport-rf'
  | 'unknown'
  | 'passport-foreign-rf'
  | 'snils-rf'
  | 'driver-license-rf'
  | 'pts-rf'
  | 'kasko-rf'
  | 'osago-rf'
  | 'birth-certificate-rf'
  | 'inn-rf'
  | 'med-insurance-international-rf'
  | 'med-insurance-rf';

export interface DocLabeled {
  label: DocLabel;
}

export interface DocState {
  stored?: DocStored;
  labeled?: DocLabeled;
  formatted?: DocFormatted;
}

export interface Doc extends DocState {
  id: string;
  imgBase64: string;
  date: number;
  tags: string[];
  comment: string;
  attachments: string[];
}

export interface DocAttachment {
  id: string;
  imgBase64: string;
}

export interface DocsState {
  docs: { [id: string]: Doc };
  attachments: { [id: string]: DocAttachment };
}
