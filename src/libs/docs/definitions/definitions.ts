import { DocForm, DocLabel } from '../models';

import { birthCertificateRF } from './birth-certificate-rf';
import { driverLicenseRF } from './driver-license-rf';
import { innRF } from './inn-rf';
import { kaskoRF } from './kasko-rf';
import { medInsuranceInternationalRF } from './med-insurance-international-rf';
import { medInsuranceRF } from './med-insurance-rf';
import { osagoRF } from './osago-rf';
import { passportForeignRF } from './passport-foreign-rf';
import { passportRF } from './passport-rf';
import { ptsRF } from './pts-rf';
import { snilsRF } from './snils-rf';
import { unknownForm } from './unknown';

const hash: { [key: /*DocLabel*/ string]: DocForm } = {
  'passport-rf': passportRF,
  unknown: unknownForm,
  'passport-foreign-rf': passportForeignRF,
  'snils-rf': snilsRF,
  'driver-license-rf': driverLicenseRF,
  'pts-rf': ptsRF,
  'kasko-rf': kaskoRF,
  'osago-rf': osagoRF,
  'birth-certificate-rf': birthCertificateRF,
  'inn-rf': innRF,
  'med-insurance-international-rf': medInsuranceInternationalRF,
  'med-insurance-rf': medInsuranceRF,
};

export const getDocForm = (label: DocLabel) => hash[label];
