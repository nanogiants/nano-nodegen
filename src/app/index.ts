import chalk from 'chalk';
import path from 'path';
import isValidPkgJsonName from 'validate-npm-package-name';
import Generator from 'yeoman-generator';

import { Features } from '../lib/enums/features';
import { Filenames } from '../lib/enums/filenames';
import { Messages } from '../lib/enums/messages';
import { Names } from '../lib/enums/names';
import { withFeature } from '../lib/helpers';
import { GithubClient } from '../lib/helpers/github.client';
import rootPkg from '../lib/helpers/package';
import { Answers } from '../lib/interfaces/answers';

const defaultAnswers: Answers = {
  [Names.PROJECT_NAME]: Names.PROJECT_NAME,
  [Names.AUTHOR]: Names.AUTHOR,
  [Names.FEATURES]: [],
  [Names.SONARQUBE]: false,
  [Names.LINT_STAGED]: false,
  [Names.WITH_LICENSE]: true,
  [Names.LICENSE]: 'mit',
  [Names.CHANGELOG]: true,
};

export default class extends Generator {
  answers!: Answers;

  async prompting(): Promise<void> {
    this.answers = await this.prompt([
      {
        type: 'input',
        name: Names.PROJECT_NAME,
        message: Messages.PROJECT_NAME,
        validate: (answer) => isValidPkgJsonName(answer).validForNewPackages,
        default: defaultAnswers.projectname,
      },
      {
        type: 'input',
        name: Names.AUTHOR,
        message: Messages.AUTHOR,
        default: defaultAnswers.author,
      },
      {
        type: 'checkbox',
        name: Names.FEATURES,
        message: Messages.FEATURES,
        default: defaultAnswers.features,
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
      {
        type: 'confirm',
        name: Names.SONARQUBE,
        message: Messages.SONARQUBE,
        default: defaultAnswers.sonarqube,
        when: (answers) => withFeature(answers, Features.JEST),
      },
      {
        type: 'confirm',
        name: Names.LINT_STAGED,
        message: Messages.LINT_STAGED,
        default: defaultAnswers[Names.LINT_STAGED],
        when: (answers) => withFeature(answers, Features.ESLINT),
      },
      {
        type: 'confirm',
        name: Names.WITH_LICENSE,
        message: Messages.WITH_LICENSE,
        default: defaultAnswers['with-license'],
      },
    ]);
    if (this.answers[Names.WITH_LICENSE]) {
      try {
        const licenses = await GithubClient.getLicenses();
        const licenseAnswer = await this.prompt([
          {
            type: 'list',
            name: Names.LICENSE,
            message: Messages.LICENSE,
            default: defaultAnswers[Names.LICENSE],
            choices: licenses.map((l: any) => ({
              name: l.name,
              value: l.key,
            })),
          },
        ]);
        this.answers[Names.LICENSE] = licenseAnswer[Names.LICENSE];
      } catch (error) {
        this.answers[Names.WITH_LICENSE] = false;
        chalk.yellow('Error while fetching licenses, skipping...');
      }
    }
    const changeLogAnswer = await this.prompt([
      {
        type: 'confirm',
        name: Names.CHANGELOG,
        message: Messages.CHANGELOG,
        default: defaultAnswers[Names.CHANGELOG],
      },
    ]);
    this.answers[Names.CHANGELOG] = changeLogAnswer[Names.CHANGELOG];
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

    if (withFeature(this.answers, Features.ESLINT)) {
      this.composeWith(require.resolve('../eslint'), {});
    }
    if (withFeature(this.answers, Features.PRETTIER)) {
      this.composeWith(require.resolve('../prettier'), {});
    }

    if (withFeature(this.answers, Features.JEST)) {
      this.composeWith(require.resolve('../jest'), {});
    }

    if (this.answers[Names.SONARQUBE]) {
      this.composeWith(require.resolve('../sonarqube'));
    }

    if (this.answers[Names.LINT_STAGED]) {
      this.composeWith(require.resolve('../lintstaged'), {
        withPrettier: withFeature(this.answers, Features.PRETTIER),
      });
    }

    if (this.answers[Names.WITH_LICENSE]) {
      this.composeWith(require.resolve('../license'), {
        license: this.answers.license,
      });
    }

    if (this.answers[Names.CHANGELOG]) {
      this.composeWith(require.resolve('../changelog'));
    }
  }

  install(): void {
    this.spawnCommandSync('git', ['init', '--quiet']);
    this.npmInstall();
  }
}
