import { DocForm } from '../models';

export const ptsRF: DocForm = {
  title: 'Паспорт Транспортного Средства',
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
      label: 'Марка, модель ТС',
      name: 'model',
      kind: 'text',
    },
    {
      label: 'Наименование (Тип ТС)',
      name: 'vehicleType',
      kind: 'text',
    },
    {
      label: 'Категория ТС',
      name: 'vehicleCategory',
      kind: 'text',
    },
    {
      label: 'Год изготовления',
      name: 'vehicleYear',
      kind: 'text',
    },
    {
      label: 'Модель, № Двигателя',
      name: 'engineNo',
      kind: 'text',
    },
    {
      label: 'Шасси (рама) №',
      name: 'chassisNo',
      kind: 'text',
    },
    {
      label: 'Кузов (кабина, прицеп) №',
      name: 'bodyNo',
      kind: 'text',
    },
    {
      label: 'Цвет кузова (кабины, прицепа)',
      name: 'bodyColor',
      kind: 'text',
    },
    {
      label: 'Мощность двигателя, л.с. (кВт)',
      name: 'enginePower',
      kind: 'text',
    },
    {
      label: 'Рабочий объем двигателя, куб. см',
      name: 'engineVol',
      kind: 'text',
    },
    {
      label: 'Тип двигателя',
      name: 'engineType',
      kind: 'text',
    },
    {
      label: 'Экологический класс',
      name: 'exoClass',
      kind: 'text',
    },
    {
      label: 'Разрешенная максимальная масса, кг',
      name: 'maxWeight',
      kind: 'text',
    },
    {
      label: 'Масса без нагрузки, кг',
      name: 'vehicleWeigth',
      kind: 'text',
    },
    {
      label: 'Организация - изготовитель ТС (страна)',
      name: 'producer',
      kind: 'text-area',
    },
    {
      label: 'Одобрение типа ТС №',
      name: 'approvalNo',
      kind: 'text',
    },
    {
      label: 'Одобрение типа ТС От',
      name: 'approvalNo',
      kind: 'text-area',
    },
    {
      label: 'Страна вывоза ТС',
      name: 'ImportCountry',
      kind: 'text',
    },
    {
      label: 'Серия, № ТД, ТПО',
      name: 'tpoNo',
      kind: 'text',
    },
    {
      label: 'Таможенные огранечения',
      name: 'customRestrictions',
      kind: 'text-area',
    },
    {
      label: 'Адрес',
      name: 'address',
      kind: 'text-area',
    },
    {
      label: 'Наименование организации выдавшей паспорт',
      name: 'issuer',
      kind: 'text-area',
    },
    {
      label: 'Дата выдачи паспорта',
      name: 'issueDate',
      kind: 'date',
    },
  ],
};
