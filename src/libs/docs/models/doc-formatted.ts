export interface DocUnknown {
  kind: 'unknown';
  text: string;
  lastName: string;
  firstName: string;
  middleName: string;
  identifier: string;
  date: string;
}

export interface DocPassportRF {
  kind: 'passport-rf';
  lastName: string;
  firstName: string;
  middleName: string;
  identifier: string;
  issuer: string;
  issueDate: string;
  sex: string;
  dateOfBirth: string;
  placeOfBirth: string;
  departmentCode: string;
}

export interface DocPassportForeignRF {
  kind: 'passport-foreign-rf';
  lastName: string;
  lastNameEn: string;
  firstName: string;
  firstNameEn: string;
  middleName: string;
  middleNameEn: string;
  identifier: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  sex: string;
  dateOfBirth: string;
  placeOfBirth: string;
  placeOfBirthEn: string;
  type: string;
}

export interface DocSNILSRF {
  kind: 'snils-rf';
  lastName: string;
  firstName: string;
  middleName: string;
  identifier: string;
  sex: string;
  dateOfBirth: string;
  placeOfBirth: string;
}

export interface DocDriverLicenseRF {
  kind: 'driver-license-rf';
  lastName: string;
  lastNameEn: string;
  firstName: string;
  firstNameEn: string;
  middleName: string;
  middleNameEn: string;
  identifier: string;
  dateOfBirth: string;
  regionOfBirth: string;
  regionOfBirthEn: string;
  issueDate: string;
  expiryDate: string;
  issuer: string;
  issuerEn: string;
  issuerRegion: string;
  issuerRegionEn: string;
  categories: string;
}

export interface PtsRF {
  kind: 'pts-rf';
  identifier: string;
  vin: string;
  lastName: string;
  firstName: string;
  middleName: string;
  model: string;
  vehicleType: string;
  vehicleCategory: string;
  vehicleYear: string;
  engineNo: string;
  chassisNo: string;
  bodyNo: string;
  bodyColor: string;
  enginePower: string;
  engineVol: string;
  engineType: string;
  ecoClass: string;
  maxWeight: string;
  vehicleWeight: string;
  producer: string;
  approvalNo: string;
  approvalFrom: string;
  importCountry: string;
  tpoNo: string;
  customRestrictions: string;
  address: string;
  issuer: string;
  issueDate: string;
}

export interface KaskoRF {
  kind: 'kasko-rf';
  identifier: string;
  type: string;
  vin: string;
  lastName: string;
  firstName: string;
  middleName: string;
  ptsNo: string;
  model: string;
  vehicleYear: string;
  enginePower: string;
  engineNo: string;
  bodyNo: string;
  plateNo: string;
  issueDate: string;
  startDate: string;
  endDate: string;
}

export interface OsagoRF {
  kind: 'osago-rf';
  identifier: string;
  issueDate: string;
  expiryDate: string;
  vin: string;
  lastName: string;
  firstName: string;
  middleName: string;
  ptsNo: string;
  model: string;
  plateNo: string;
}

export interface BirthCertificateRF {
  kind: 'birth-certificate-rf';
  identifier: string;
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  birthPlace: string;
  issueDate: string;
  authorityDate: string;
  authority: string;
  fatherLastName: string;
  fatherFirstName: string;
  fatherMiddleName: string;
  motherLastName: string;
  motherFirstName: string;
  motherMiddleName: string;
  docNumber: string;
}

export interface InnRF {
  kind: 'inn-rf';
  identifier: string;
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  birthPlace: string;
  issueDate: string;
  authorityCode: string;
  authority: string;
  sex: string;
  docNumber: string;
}

export interface MedInsuranceInternationalRF {
  kind: 'med-insurance-international-rf';
  identifier: string;
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  address: string;
  passportNo: string;
  issueDate: string;
  startDate: string;
  endDate: string;
  issuer: string;
  country: string;
  territory: string;
  coverage: string;
  specialTerms: string;
}

export interface MedInsuranceRF {
  kind: 'med-insurance-rf';
  identifier: string;
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  sex: string;
}

export type DocFormatted =
  | DocPassportRF
  | DocUnknown
  | DocPassportForeignRF
  | DocSNILSRF
  | DocDriverLicenseRF
  | PtsRF
  | KaskoRF
  | OsagoRF
  | BirthCertificateRF
  | InnRF
  | MedInsuranceInternationalRF
  | MedInsuranceRF;
