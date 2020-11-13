import isValidPkgJsonName from 'validate-npm-package-name';

import { Features } from '../enums/features';

export const withFeature = (answers: any, feature: Features): boolean => {
  return answers.features.some((_feature: Features) => _feature === feature);
};

export const validatePackageJsonName = (answer: string) => {
  return isValidPkgJsonName(answer).validForNewPackages;
};
