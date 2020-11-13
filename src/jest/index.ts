import path from 'path';
import Generator from 'yeoman-generator';

import { Filenames } from '../lib/enums/filenames';
import rootPkg from '../lib/helpers/package';

module.exports = class extends Generator {
  writing() {
    this.fs.append(this.destinationPath(Filenames.README), this.fs.read(this.templatePath(Filenames.README)));

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
