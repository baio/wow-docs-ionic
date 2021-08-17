import { parse } from 'date-fns';
import { DocFormatted, DocPassportRF } from '../../models';
import { ParsedDoc, PassportRF } from './doc-api.dto';

const mapDate = (dto: string) => {
  try {
    return dto && parse(dto, 'dd.MM.yyyy', new Date()).toISOString();
  } catch {
    return null;
  }
};

const mapPassportRF = (dto: PassportRF): DocPassportRF => ({
  kind: 'passport-rf',
  lastName: dto.lastName,
  firstName: dto.firstName,
  middleName: dto.middleName,
  identifier: dto.identifier,
  issuer: dto.issuer,
  issueDate: mapDate(dto.issueDate),
  sex: dto.sex,
  dateOfBirth: mapDate(dto.birthDate),
  placeOfBirth: dto.birthPlace,
  departmentCode: dto.issuerCode,
});

export const mapDocFormatted = (dto: ParsedDoc): DocFormatted => {
  if (!dto) {
    return null;
  }
  if (dto.PassportRF) {
    return mapPassportRF(dto.PassportRF);
  } else {
    return null;
  }
};
