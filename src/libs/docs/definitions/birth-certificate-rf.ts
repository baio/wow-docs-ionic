import { DocForm } from '../models';

export const birthCertificateRF: DocForm = {
  title: 'Свидетельство о рождении',
  fields: [
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
      kind: 'date',
      label: 'Дата Рождения',
      name: 'birthDate',
    },
    {
      kind: 'text-area',
      label: 'Место Рождения',
      name: 'birthPlace',
    },
    {
      name: 'authorityDate',
      label: 'Дата Акта',
      kind: 'date',
    },
    {
      name: 'identifier',
      label: 'Номер Акта',
      kind: 'text',
    },
    {
      name: 'fatherLastName',
      kind: 'text',
      label: 'Фамилия Отца',
      group: 'fatherName',
    },
    {
      name: 'fatherFirstName',
      kind: 'text',
      label: 'Имя Отца',
      group: 'fatherName',
    },
    {
      name: 'fatherMiddleName',
      kind: 'text',
      label: 'Очество Отца',
      group: 'fatherName',
    },
    {
      name: 'matherLastName',
      kind: 'text',
      label: 'Фамилия Матери',
      group: 'matherName',
    },
    {
      name: 'matherFirstName',
      kind: 'text',
      label: 'Имя Матери',
      group: 'matherName',
    },
    {
      name: 'matherMiddleName',
      kind: 'text',
      label: 'Очество Матери',
      group: 'matherName',
    },
    {
      name: 'issueDate',
      kind: 'date',
      label: 'Дата Выдачи',
    },
    {
      kind: 'text',
      label: 'Номер документа',
      name: 'docNumber',
    },
  ],
};
