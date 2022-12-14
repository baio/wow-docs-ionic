import { DocForm } from '../models';

export const driverLicenseRF: DocForm = {
  title: 'Водительское РФ',
  fields: [
    {
      label: 'Номер / No.',
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
      name: 'lastNameEn',
      kind: 'text',
      label: 'Last Name',
      group: 'nameEn',
    },
    {
      name: 'firstNameEn',
      kind: 'text',
      label: 'First Name',
      group: 'nameEn',
    },
    {
      name: 'middleNameEn',
      kind: 'text',
      label: 'Middle Name',
      group: 'nameEn',
    },
    {
      label: 'Дата рождения / Date of birth',
      kind: 'date',
      name: 'dateOfBirth',
    },
    {
      label: 'Место Рождения / Place of Birth',
      name: 'regionOfBirth',
      kind: 'text-area',
    },
    {
      label: 'Дата Выдачи / Date of Issue',
      name: 'issueDate',
      kind: 'date',
    },
    {
      label: 'Дата Окончания / Date of Expiry',
      name: 'expiryDate',
      kind: 'date',
    },
    {
      label: 'Выдано',
      name: 'issuer',
      kind: 'text',
      group: 'issuer',
    },
    {
      label: 'Issuer',
      name: 'issuerEn',
      kind: 'text',
      group: 'issuer',
    },
    {
      label: 'Регион',
      name: 'issuerRegion',
      kind: 'text',
      group: 'region',
    },
    {
      label: 'Region',
      name: 'issuerRegionEn',
      kind: 'text',
      group: 'region',
    },
    {
      label: 'Категории / Categories',
      name: 'categories',
      kind: 'text',
    },
  ],
};
