import { DocForm } from '../models';

export const medInsuranceInternationalRF: DocForm = {
  title: 'Международный Страховой Полис',
  fields: [
    {
      label: '№ Полиса / Policy number',
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
      label: 'Дата рождения / Date of Birth',
      name: 'birthDate',
      kind: 'date',
    },
    {
      label: 'Адресс / Address',
      name: 'address',
      kind: 'text-area',
    },
    {
      label: 'Паспорт № / Passport No',
      name: 'passportNo',
      kind: 'text',
    },
    {
      label: 'Дата выдачи / Issue Date',
      name: 'issueDate',
      kind: 'date',
    },
    {
      label: 'С / Start Date',
      name: 'startDate',
      kind: 'date',
    },
    {
      label: 'По / End Date',
      name: 'endDate',
      kind: 'date',
    },
    {
      label: 'Страховщик / Issuer',
      name: 'issuer',
      kind: 'text',
    },
    {
      label: 'Особые условия / Special Terms',
      name: 'specialTerms',
      kind: 'sex',
    },
    {
      label: 'Страна / Country',
      name: 'country',
      kind: 'text',
    },
    {
      label: 'Территория / Territorialityy',
      name: 'territory',
      kind: 'text',
    },
    {
      label: 'Программа / Coverage',
      name: 'territory',
      kind: 'text',
    },
  ],
};
