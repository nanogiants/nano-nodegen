import { Features } from '../enums/features';

export const withFeature = (answers: any, feature: Features): boolean => {
  return answers.features.some((_feature: Features) => _feature === feature);
};
