import path from 'path';
import Generator from 'yeoman-generator';

import { Features } from '../../enums/features';
import { Filenames } from '../../enums/filenames';

export const createJest = (ctx: Generator): void => {
  ctx.fs.copy(
    ctx.templatePath(path.join(Features.JEST, Filenames.JEST_TEST)),
    ctx.destinationPath(
      path.join(Filenames.SRC_FOLDER, 'lib', Filenames.JEST_TEST)
    )
  );
  ctx.fs.copy(
    ctx.templatePath(path.join(Features.JEST, Filenames.JEST_CONFIG)),
    ctx.destinationPath(Filenames.JEST_CONFIG)
  );

  ctx.fs.extendJSON(ctx.destinationPath(Filenames.PACKAGE_JSON), {
    scripts: {
      test: 'jest --runInBand',
      'test:cov': 'jest --coverage --runInBand',
    },
    devDependencies: {
      '@types/jest': '^26.0.3',
      jest: '^26.1.0',
      'ts-jest': '^26.1.1',
    },
  });
};
