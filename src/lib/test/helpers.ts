import { Answers } from 'yeoman-generator';
import helpers from 'yeoman-test';

import { Names } from '../enums/names';

export const runBaseGenerator = async (additionalProps: Answers) => {
  return helpers
    .run(require.resolve('../../app'))
    .withPrompts({
      [Names.PROJECT_NAME]: 'hans',
      [Names.AUTHOR]: 'r.heinen@nanogiants.de',
      ...additionalProps,
    })
    .withOptions({ skipInstall: true });
};
