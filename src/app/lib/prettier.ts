import Generator from 'yeoman-generator';

import { Filenames } from '../../enums/filenames';

export const createPrettier = (ctx: Generator): void => {
  ctx.fs.copy(
    ctx.templatePath(Filenames.PRETTIER_CONFIG),
    ctx.destinationPath(Filenames.PRETTIER_CONFIG)
  );
  ctx.fs.extendJSON(ctx.destinationPath(Filenames.PACKAGE_JSON), {
    devDependencies: {
      prettier: '^2.0.5',
    },
  });
};
