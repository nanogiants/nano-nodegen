import path from 'path';
import Generator from 'yeoman-generator';

import { Filenames } from '../../enums/filenames';
import { Names } from '../../enums/names';

interface IConfig {
  withPrettier: boolean;
}

export const createLintStaged = (ctx: Generator, config: IConfig): void => {
  const { withPrettier } = config;
  const lintStagedCommands = ['eslint . --fix', 'git add'];

  // add prettier command to lint-staged
  if (withPrettier) {
    lintStagedCommands.splice(1, 0, 'prettier --write');
  }

  ctx.fs.extendJSON(ctx.destinationPath(Filenames.PACKAGE_JSON), {
    scripts: {
      husky: '^4.2.5',
      'lint-staged': '^10.2.11',
    },
    'lint-staged': {
      'src/**/*.{js,ts}': lintStagedCommands,
    },
    husky: {
      hooks: {
        'pre-commit': 'lint-staged',
      },
    },
  });
};
