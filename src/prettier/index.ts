import Generator from 'yeoman-generator';

import { Filenames } from '../lib/enums/filenames';
import rootPkg from '../lib/helpers/package';

module.exports = class extends Generator {
  writing() {
    this.fs.copy(this.templatePath(Filenames.PRETTIER_CONFIG), this.destinationPath(Filenames.PRETTIER_CONFIG));
    this.fs.extendJSON(this.destinationPath(Filenames.PACKAGE_JSON), {
      devDependencies: {
        prettier: rootPkg.devDependencies.prettier,
      },
    });
  }
};
