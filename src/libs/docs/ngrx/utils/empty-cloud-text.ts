import { DocUnknown } from '../../models';
import { DocMeta } from './doc-meta';
import { flatStr, flatTags, parseLines, unFlatStr, unFlatTags } from './str-utils';

export const formatEmptyCloudText = (meta: DocMeta) => {
  const VERSION = 1;
  const text = `
  ВЕРСИЯ
  ${VERSION}
  ТИП ДОКУМЕНТА
  ПУСТОЙ
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

export const parseEmptyCloudText = (text: string) => {
  const lines = parseLines(text);
  if (lines[3] === 'ПУСТОЙ') {
    const docMeta = {
      tags: unFlatTags(lines[5]),
      comment: unFlatStr(lines[7]),
      date: lines[9] ? +lines[9] : null,
      attachments: unFlatTags(lines[11]),
    } as DocMeta;
    return {
      docFormatted: null,
      docMeta,
    };
  } else {
    return null;
  }
};
