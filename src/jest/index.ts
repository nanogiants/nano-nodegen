import path from 'path';
import Generator from 'yeoman-generator';

import { Filenames } from '../lib/enums/filenames';
import rootPkg from '../lib/helpers/package';

module.exports = class extends Generator {
  token: string | null;
  constructor(args: string | string[], config: any) {
    super(args, config);
    this.token = config.token;
  }

  writing() {
    this.fs.copy(
      this.templatePath(Filenames.JEST_TEST),
      this.destinationPath(path.join(Filenames.SRC_FOLDER, 'lib', Filenames.JEST_TEST)),
    );
    this.fs.copy(this.templatePath(Filenames.JEST_CONFIG), this.destinationPath(Filenames.JEST_CONFIG));

    this.fs.extendJSON(this.destinationPath(Filenames.PACKAGE_JSON), {
      scripts: {
        test: 'jest --runInBand',
        'test:cov': 'jest --coverage --runInBand',
      },
      devDependencies: {
        '@types/jest': rootPkg.devDependencies['@types/jest'],
        jest: rootPkg.devDependencies.jest,
        'ts-jest': rootPkg.devDependencies['ts-jest'],
      },
    });
  }
};
