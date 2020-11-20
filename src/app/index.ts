import path from 'path';
import Generator, { Answers } from 'yeoman-generator';

import { Features } from '../lib/enums/features';
import { Filenames } from '../lib/enums/filenames';
import { Messages } from '../lib/enums/messages';
import { Names } from '../lib/enums/names';
import { withFeature, validatePackageJsonName } from '../lib/helpers';
import rootPkg from '../lib/helpers/package';

export default class extends Generator {
  answers!: Answers;

  async prompting(): Promise<void> {
    this.answers = await this.prompt([
      {
        type: 'input',
        name: Names.PROJECT_NAME,
        message: Messages.PROJECT_NAME,
        validate: validatePackageJsonName,
        default: Names.PROJECT_NAME,
      },
      {
        type: 'input',
        name: Names.AUTHOR,
        message: Messages.AUTHOR,
        default: Names.AUTHOR,
      },
      {
        type: 'checkbox',
        name: Names.FEATURES,
        message: Messages.FEATURES,
        default: [],
        choices: [
          {
            name: Features.ESLINT,
            value: Features.ESLINT,
          },
          {
            name: Features.PRETTIER,
            value: Features.PRETTIER,
          },
          {
            name: Features.JEST,
            value: Features.JEST,
          },
        ],
      },
    ]);
  }

  writing(): void {
    this.destinationRoot(path.join(this.destinationRoot(), '/', this.answers[Names.PROJECT_NAME]));

    [
      Filenames.TS_CONFIG,
      Filenames.NODEMON_CONFIG,
      Filenames.GIT_IGNORE,
      Filenames.SRC_FOLDER,
      Filenames.README,
    ].forEach((fileName: Filenames) => {
      this.fs.copy(
        this.templatePath(fileName),
        fileName === Filenames.GIT_IGNORE ? this.destinationPath(`.${fileName}`) : this.destinationPath(fileName),
      );
    });

    this.fs.writeJSON(this.destinationPath(Filenames.PACKAGE_JSON), {
      name: this.answers.projectname,
      version: '0.1.0',
      description: 'A node starter',
      main: 'index.js',
      scripts: {
        build: 'rimraf ./build && tsc',
        start: 'npm run build && node build/index.js',
        'start:dev': 'nodemon',
      },
      author: this.answers.author,
      devDependencies: {
        '@types/node': rootPkg.devDependencies['@types/node'],
        nodemon: rootPkg.devDependencies.nodemon,
        rimraf: rootPkg.devDependencies.rimraf,
        'ts-node': rootPkg.devDependencies['ts-node'],
        typescript: rootPkg.devDependencies.typescript,
      },
    });

    if (withFeature(this.answers, Features.JEST)) {
      this.composeWith(require.resolve('../jest'));
      this.composeWith(require.resolve('../sonarqube'));
    }

    if (withFeature(this.answers, Features.PRETTIER)) {
      this.composeWith(require.resolve('../prettier'));
    }

    if (withFeature(this.answers, Features.ESLINT)) {
      this.composeWith(require.resolve('../eslint'));
      this.composeWith(require.resolve('../lintstaged'), {
        withPrettier: withFeature(this.answers, Features.PRETTIER),
      });
    }

    this.composeWith(require.resolve('../changelog'));

    this.composeWith(require.resolve('../license'), {
      license: this.answers.license,
    });
  }

  install(): void {
    this.spawnCommandSync('git', ['init', '--quiet']);
    this.npmInstall();
  }
}
