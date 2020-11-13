import Generator, { Answers } from 'yeoman-generator';

import { Filenames } from '../lib/enums/filenames';
import { Messages } from '../lib/enums/messages';
import { Names } from '../lib/enums/names';
import rootPkg from '../lib/helpers/package';

module.exports = class extends Generator {
  answers!: Answers;

  async prompting(): Promise<void> {
    this.answers = await this.prompt({
      type: 'confirm',
      name: Names.CHANGELOG,
      message: Messages.CHANGELOG,
      default: true,
    });
  }

  writing() {
    if (this.answers[Names.CHANGELOG]) {
      this.fs.append(this.destinationPath(Filenames.README), this.fs.read(this.templatePath(Filenames.README)));

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
  }
};
