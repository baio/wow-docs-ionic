import { DocFormatted, DocLabel } from '../../../models';

export interface DocCaption {
  title: string;
  subTitle: string;
}

const getSubtitle = (label: DocLabel) => {
  switch (label) {
    case 'unknown':
      return 'Другое';
    case 'passport-rf':
      return 'Паспорт';
    case 'passport-foreign-rf':
      return 'Загран';
    case 'snils-rf':
      return 'СНИЛС';
    case 'driver-license-rf':
      return 'Водительское';
    default:
      return 'Неизвестный';
  }
};

export const getCaption = (formatted: DocFormatted): DocCaption => {
  const subTitle = getSubtitle(formatted.kind);
  return {
    title:
      formatted.lastName || formatted.firstName || (formatted as any).middleName
        ? [
            formatted.lastName,
            formatted.firstName,
            (formatted as any).middleName,
          ]
            .join(' ')
            .trim()
        : null,

    subTitle,
  };
};
