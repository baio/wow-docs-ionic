import { DocUnknown } from '../../models';
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

export const formatUnknownCloudText = (
  docFormatted: DocUnknown,
  meta: DocMeta
) => {
  const VERSION = 1;
  const text = `
  ВЕРСИЯ
  ${VERSION}
  ТИП ДОКУМЕНТА
  НЕИЗВЕСТНЫЙ
  ФАМИЛИЯ
  ${docFormatted.lastName || ''}
  ИМЯ
  ${docFormatted.firstName || ''}
  ОЧЕСТВО
  ${docFormatted.middleName || ''}
  НОМЕР
  ${docFormatted.identifier || ''}
  ДАТА
  ${formatDate(docFormatted.date)}
  ТЕКСТ
  ${flatStr(docFormatted.text)}
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

export const parseUnknownCloudText = (text: string) => {
  const lines = parseLines(text);
  if (lines[3] === 'НЕИЗВЕСТНЫЙ') {
    const docFormatted = {
      kind: 'unknown',
      text: unFlatStr(lines[5]),
      lastName: lines[5] || null,
      firstName: lines[7] || null,
      middleName: lines[9] || null,
      identifier: lines[11] || null,
      date: parseDate(lines[13]),
    } as DocUnknown;

    const docMeta = {
      tags: unFlatTags(lines[15]),
      comment: unFlatStr(lines[17]),
      date: lines[19] ? +lines[19] : null,
      attachments: unFlatTags(lines[21]),
    } as DocMeta;
    return {
      docFormatted,
      docMeta,
    };
  } else {
    return null;
  }
};
