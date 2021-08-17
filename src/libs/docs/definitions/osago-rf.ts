import { DocForm } from '../models';

export const osagoRF: DocForm = {
  title: 'ОСАГО',
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
      label: 'Номер',
      name: 'identifier',
      kind: 'text',
    },
    {
      label: 'Идентификационный номер (VIN)',
      name: 'vin',
      kind: 'text',
    },
    {
      label: 'ПТС №',
      name: 'ptsNo',
      kind: 'text',
    },
    {
      label: 'Номер',
      name: 'plateNo',
      kind: 'text',
    },
    {
      label: 'Дата начала',
      name: 'issueDate',
      kind: 'date',
    },
    {
      label: 'Дата окончания',
      name: 'expiryDate',
      kind: 'date',
    },
  ],
};
