import { format, parse } from 'date-fns';
import { DocPassportRF } from '../../models';
import { DocMeta } from './doc-meta';
import {
  flatStr,
  flatTags,
  formatDate,
  parseDate,
  parseLines,
  unFlatStr,
  unFlatTags,
} from './str-utils';

export const formatPassportRFCloudText = (
  docFormatted: DocPassportRF,
  meta: DocMeta
) => {
  const VERSION = 1;
  const text = `
  ВЕРСИЯ
  ${VERSION}
  ТИП ДОКУМЕНТА
  ПАСПОРТ РФ
  ФАМИЛИЯ
  ${docFormatted.lastName || ''}
  ИМЯ
  ${docFormatted.firstName || ''}
  ОЧЕСТВО
  ${docFormatted.middleName || ''}
  СЕРИЯ НОМЕР
  ${docFormatted.identifier || ''}
  ПАСПОРТ ВЫДАН
  ${docFormatted.issuer || ''}
  ДАТА ВЫДАЧИ
  ${formatDate(docFormatted.issueDate)}
  КОД ПОДРАЗДЕЛЕНИЯ
  ${docFormatted.departmentCode || ''}
  ПОЛ
  ${
    docFormatted.sex
      ? docFormatted.sex === 'male'
        ? 'мужской'
        : 'женский'
      : ''
  }
  ДАТА РОЖДЕНИЯ
  ${formatDate(docFormatted.dateOfBirth)}
  МЕСТО РОЖДЕНИЯ
  ${docFormatted.placeOfBirth || ''}
  ТАГИ
  ${flatTags(meta.tags)}
  КОММЕНТАРИЙ
  ${flatStr(meta.comment)}
  СИСТЕМНАЯ ДАТА
  ${meta.date}
  ПРИЛОЖЕНИЯ
  ${flatTags(meta.attachments)}
  `;
  return text;
};

export const parsePassportRFCloudText = (text: string) => {
  const lines = parseLines(text);
  if (lines[3] === 'ПАСПОРТ РФ') {
    const docFormatted = {
      kind: 'passport-rf',
      lastName: lines[5] || null,
      firstName: lines[7] || null,
      middleName: lines[9] || null,
      identifier: lines[11] || null,
      issuer: unFlatStr(lines[13]),
      issueDate: parseDate(lines[15]),
      sex: lines[17] ? (lines[17] === 'мужской' ? 'male' : 'feamle') : null,
      dateOfBirth: parseDate(lines[19]),
      placeOfBirth: lines[21]
        ? parse(lines[21], 'dd.MM.yyyy', null).toISOString()
        : null,
      departmentCode: lines[23] || null,
    } as DocPassportRF;

    const docMeta = {
      tags: unFlatTags(lines[25]),
      comment: unFlatStr(lines[27]),
      date: lines[29] ? +lines[29] : null,
      attachments: unFlatTags(lines[31]),
    } as DocMeta;

    return {
      docFormatted,
      docMeta,
    };
  } else {
    return null;
  }
};
