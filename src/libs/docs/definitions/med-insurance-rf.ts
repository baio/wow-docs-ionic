import { DocForm } from '../models';

export const medInsuranceRF: DocForm = {
  title: 'Медицинский полис (ОМС)',
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
      label: 'Персональный Номер',
      name: 'identifier',
      kind: 'text',
    },
    {
      label: 'Дата Рождения',
      name: 'birthDate',
      kind: 'text',
    },
    {
      label: 'Пол',
      name: 'sex',
      kind: 'sex',
    },
  ],
};
