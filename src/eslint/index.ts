import Generator from 'yeoman-generator';

import { Filenames } from '../lib/enums/filenames';
import rootPkg from '../lib/helpers/package';

module.exports = class extends Generator {
  writing() {
    const pkgJson = {
      devDependencies: {
        '@typescript-eslint/eslint-plugin':
          rootPkg.devDependencies['@typescript-eslint/eslint-plugin'],
        '@typescript-eslint/parser':
          rootPkg.devDependencies['@typescript-eslint/parser'],
        eslint: rootPkg.devDependencies.eslint,
        'eslint-plugin-import': rootPkg.devDependencies['eslint-plugin-import'],
      },
    };

    this.fs.extendJSON(this.destinationPath(Filenames.PACKAGE_JSON), pkgJson);

    this.fs.copy(
      this.templatePath(Filenames.ESLINT_CONFIG),
      this.destinationPath(Filenames.ESLINT_CONFIG)
    );
  }
};
