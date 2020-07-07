import axios from 'axios';

import { Features } from '../enums/features';
export const withFeature = (answers: any, feature: Features): boolean => {
  return answers.features.some((_feature: Features) => _feature === feature);
};

export const getLicenses = async () => {
  const { data } = await axios.get('https://api.github.com/licenses');
  return data;
};

export const getLicense = async (key: string) => {
  const { data } = await axios.get(`https://api.github.com/licenses/${key}`);
  return data.body;
};
