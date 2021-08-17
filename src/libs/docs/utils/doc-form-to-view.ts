import { format } from 'date-fns';
import { Dictionary } from 'lodash';
import { groupBy } from 'lodash/fp';
import {
  DocForm,
  DocFormatted,
  DocFormField,
  DocView,
  DocViewField,
  OptItem,
} from '../models';

export const asDate = (str: string) => {
  try {
    return (str && format(new Date(str), 'dd.MM.yyyy')) || '';
  } catch {
    return null;
  }
};

export const joinStr = (str: string[], chr = ' ') => {
  const filtered = str.filter((f) => !!f);
  return filtered.length > 0 ? filtered.join(chr) : '';
};

export const asStr = (str: string) => str || '';

export const asSex = (str: string) =>
  str ? (str === 'male' ? 'мужской' : 'женский') : '';

export const asOptItem = (str: string, optItems: OptItem[]) => {
  const item = optItems.find((f) => f.key === str);
  return item ? item.label : '';
};

const formatFormFieldValue = (formField: DocFormField, val: string): string => {
  switch (formField.kind) {
    case 'date':
      return asDate(val);
    case 'sex':
      return asSex(val);
    case 'select':
      return asOptItem(val, formField.items);
    default:
      return asStr(val);
  }
};

const docFormFieldToDocViewField =
  (groups: Dictionary<DocFormField[]>, docFormatted: DocFormatted) =>
  (field: DocFormField): DocViewField => {
    const group = field.group ? groups[field.group] : null;
    if (group) {
      const fieldGroupIndex = group.findIndex((f) => f.name === field.name);
      if (fieldGroupIndex === 0) {
        return {
          label: joinStr(group.map((f) => f.label)),
          value: joinStr(
            group.map((f) => formatFormFieldValue(f, docFormatted[f.name]))
          ),
        };
      } else {
        return { label: field.label, value: null };
      }
    } else {
      return {
        label: field.label,
        value: docFormatted[field.name]
          ? formatFormFieldValue(field, docFormatted[field.name])
          : '',
      };
    }
  };

const getGroups = (docForm: DocForm) => {
  const grouped = groupBy('group', docForm.fields);
  return grouped;
};
export const docFormToView = (docFormatted: DocFormatted, docForm: DocForm) => {
  const groups = getGroups(docForm);
  return {
    title: docForm.title,
    fields: docForm.fields
      .map(docFormFieldToDocViewField(groups, docFormatted))
      .filter((f) => !!f.value),
  } as DocView;
};
