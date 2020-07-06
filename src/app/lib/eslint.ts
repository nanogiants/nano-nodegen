import Generator from 'yeoman-generator';

import { Filenames } from '../../enums/filenames';

export const createEslint = (ctx: Generator): void => {
  ctx.fs.copy(
    ctx.templatePath(Filenames.ESLINT_CONFIG),
    ctx.destinationPath(Filenames.ESLINT_CONFIG)
  );
  ctx.fs.extendJSON(ctx.destinationPath(Filenames.PACKAGE_JSON), {
    devDependencies: {
      '@typescript-eslint/eslint-plugin': '^3.5.0',
      '@typescript-eslint/parser': '^3.5.0',
      eslint: '^7.3.1',
      'eslint-plugin-import': '^2.22.0',
    },
  });
};
