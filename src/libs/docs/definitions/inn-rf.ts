import { DocForm } from '../models';

export const innRF: DocForm = {
  title: 'ИНН РФ',
  fields: [
    {
      label: 'ИНН',
      name: 'identifier',
      kind: 'text',
    },
    {
      name: 'lastName',
      kind: 'text',
      label: 'Фамилия',
      group: 'name',
    },
    {
      name: 'firstName',
      kind: 'text',
      label: 'Имя',
      group: 'name',
    },
    {
      name: 'middleName',
      kind: 'text',
      label: 'Очество',
      group: 'name',
    },
    {
      label: 'Пол',
      kind: 'sex',
      name: 'sex',
    },
    {
      label: 'Дата рождения',
      name: 'birthDate',
      kind: 'date',
    },
    {
      label: 'Место рождения',
      name: 'birthPlace',
      kind: 'text-area',
    },
    {
      label: 'Дата постановки на учет',
      name: 'issueDate',
      kind: 'date',
    },
    {
      label: 'Налоговый орган',
      name: 'authority',
      kind: 'text-area',
    },
    {
      label: 'Код налогового органа',
      name: 'authorityCode',
      kind: 'text',
    },
    {
      label: 'Номер документа',
      name: 'docNumber',
      kind: 'text',
    },
  ],
};
