import { Features } from '../enums/features';
import { Names } from '../enums/names';

export interface Answers {
  [Names.PROJECT_NAME]: string;
  [Names.AUTHOR]: string;
  [Names.FEATURES]: Features[];
  [Names.SONARQUBE]: boolean;
  [Names.LINT_STAGED]: boolean;
  [Names.WITH_LICENSE]: boolean;
  [Names.LICENSE]: string;
  [Names.CHANGELOG]: boolean;
}
