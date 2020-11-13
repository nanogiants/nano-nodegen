import Generator from 'yeoman-generator';

import { Filenames } from '../lib/enums/filenames';
import rootPkg from '../lib/helpers/package';

module.exports = class extends Generator {
  writing() {
    const pkgJson = {
      scripts: {
        'init-changelog': 'conventional-changelog -p angular -i CHANGELOG.md -s -r 0',
        version: 'conventional-changelog -p angular -i CHANGELOG.md -s && git add CHANGELOG.md',
      },
      devDependencies: {
        'conventional-changelog-cli': rootPkg.devDependencies['conventional-changelog-cli'],
      },
    };

    this.fs.extendJSON(this.destinationPath(Filenames.PACKAGE_JSON), pkgJson);
  }
};
