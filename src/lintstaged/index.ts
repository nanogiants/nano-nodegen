import Generator, { Answers } from 'yeoman-generator';

import { Filenames } from '../lib/enums/filenames';
import { Messages } from '../lib/enums/messages';
import { Names } from '../lib/enums/names';
import rootPkg from '../lib/helpers/package';

module.exports = class extends Generator {
  withPrettier = false;
  constructor(args: string | string[], config: any) {
    super(args, config);
    this.withPrettier = config.withPrettier;
  }

  answers!: Answers;

  async prompting(): Promise<void> {
    this.answers = await this.prompt({
      type: 'confirm',
      name: Names.LINT_STAGED,
      message: Messages.LINT_STAGED,
      default: false,
    });
  }

  writing() {
    if (this.answers[Names.LINT_STAGED]) {
      this.fs.append(this.destinationPath(Filenames.README), this.fs.read(this.templatePath(Filenames.README)));

      const lintStagedCommands = ['eslint . --fix', 'git add'];

      // add prettier command to lint-staged
      if (this.withPrettier) {
        lintStagedCommands.splice(1, 0, 'prettier --write');
      }

      this.fs.extendJSON(this.destinationPath(Filenames.PACKAGE_JSON), {
        devDependencies: {
          husky: rootPkg.devDependencies.husky,
          'lint-staged': rootPkg.devDependencies['lint-staged'],
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
    }
  }
};
