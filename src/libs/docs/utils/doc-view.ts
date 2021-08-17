import { getDocForm } from '../definitions';
import { Doc, DocFormatted, DocView } from '../models';
import { docFormToView } from './doc-form-to-view';

export const docViewToText = (docView: DocView): string => {
  const content = docView.fields.reduce(
    (acc, field) =>
      field.value ? acc + '\n' + `${field.label} : ${field.value}` : acc,
    ''
  );
  return `${docView.title}${content ? '\n' + content : ''}`;
};

export const docToText = (doc: Doc): string => {
  const docFormatted =
    doc.formatted ||
    (doc.labeled?.label
      ? ({ kind: doc.labeled?.label } as DocFormatted)
      : null);
  return docFormatted
    ? docViewToText(docFormToView(docFormatted, getDocForm(docFormatted.kind)))
    : null;
};
