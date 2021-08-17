import { DocFormatted, DocPassportRF, DocUnknown } from '../../models';

export const getDocFormattedPassportRFUpdateValues = (data: DocPassportRF) => ({
  lastName: data.lastName,
  firstMiddleName:
    data.firstName || data.middleName
      ? [data.firstName, data.middleName].join()
      : null,
});

export const getEmpty = () => ({
  lastName: null,
  firstMiddleName: null,
});

export const getDocFormattedUpdateValues = (docFormatted: DocFormatted) => {
  switch (docFormatted.kind) {
    case 'passport-rf':
      return getDocFormattedPassportRFUpdateValues(docFormatted);
    case 'unknown':
      return getEmpty();
    default:
      return getEmpty();
  }
};
