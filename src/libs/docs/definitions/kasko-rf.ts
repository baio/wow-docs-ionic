import { DocForm } from '../models';

export const kaskoRF: DocForm = {
  title: 'КАСКО',
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
      name: 'startDate',
      kind: 'date',
    },
    {
      label: 'Дата окончания',
      name: 'endDate',
      kind: 'date',
    },
  ],
};
