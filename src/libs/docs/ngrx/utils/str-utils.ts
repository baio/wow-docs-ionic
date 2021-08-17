import format from 'date-fns/format';
import parse from 'date-fns/parse';

export const flatStr = (str: string) => (str ? str.replace(/\n/g, '|') : '');
export const unFlatStr = (str: string) =>
  str ? str.replace(/\|/g, '/n') : null;

export const flatTags = (str: string[]) => (str ? str.join(',') : '');
export const unFlatTags = (str: string) =>
  (str || '').split(',').filter((f) => !!f);

export const parseLines = (text: string) =>
  text
    .replace(/^\n/, '')
    .split('\n')
    .map((m) => m.replace(/^\s+/, '').replace(/\s+$/, ''));

export const formatDate = (str: string) =>
  str ? format(new Date(str), 'dd.MM.yyyy') : '';

export const parseDate = (str: string) =>
  str ? parse(str, 'dd.MM.yyyy', null).toISOString() : null;
