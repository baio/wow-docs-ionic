import { DocForm } from '../models';

export const passportRF: DocForm = {
  title: 'Паспорт РФ',
  fields: [
    {
      kind: 'text',
      name: 'lastName',
      label: 'Фамилия',
      group: 'name',
    },
    {
      kind: 'text',
      name: 'firstName',
      label: 'Имя',
      group: 'name',
    },
    {
      kind: 'text',
      name: 'middleName',
      label: 'Отчество',
      group: 'name',
    },
    {
      kind: 'number',
      name: 'identifier',
      label: 'Номер',
    },
    {
      kind: 'text-area',
      name: 'issuer',
      label: 'Паспорт выдан',
    },
    {
      kind: 'date',
      name: 'issueDate',
      label: 'Дата выдачи',
    },
    {
      kind: 'sex',
      name: 'sex',
      label: 'Пол',
    },
    {
      kind: 'date',
      name: 'dateOfBirth',
      label: 'Дата рождения',
    },
    {
      kind: 'text-area',
      name: 'placeOfBirth',
      label: 'Место рождения',
    },
    {
      kind: 'text',
      name: 'departmentCode',
      label: 'Код департамента',
    },
  ],
};
