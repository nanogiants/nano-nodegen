import isValidPkgJsonName from 'validate-npm-package-name';
import Generator from 'yeoman-generator';

import { Features } from '../lib/enums/features';
import { Filenames } from '../lib/enums/filenames';
import { Messages } from '../lib/enums/messages';
import { Names } from '../lib/enums/names';
import { withFeature, getLicenses } from '../lib/helpers';
import rootPkg from '../lib/helpers/package';
interface Answers {
  [Names.PROJECT_NAME]: string;
  [Names.AUTHOR]: string;
  [Names.FEATURES]: Features[];
  [Names.SONARQUBE]: boolean;
  [Names.LINT_STAGED]: boolean;
  [Names.SONARQUBE_TOKEN]: string | null;
  [Names.WITH_LICENSE]: boolean;
  [Names.LICENSE]: string;
}

const defaultAnswers: Answers = {
  [Names.PROJECT_NAME]: Names.PROJECT_NAME,
  [Names.AUTHOR]: Names.AUTHOR,
  [Names.FEATURES]: [],
  [Names.SONARQUBE]: false,
  [Names.LINT_STAGED]: false,
  [Names.SONARQUBE_TOKEN]: null,
  [Names.WITH_LICENSE]: true,
  [Names.LICENSE]: 'mit',
};

export default class extends Generator {
  answers: Answers = defaultAnswers;

  async prompting(): Promise<void> {
    const answers = await this.prompt([
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
        type: 'input',
        name: Names.SONARQUBE_TOKEN,
        message: Messages.SONARQUBE_TOKEN,
        default: defaultAnswers[Names.SONARQUBE_TOKEN],
        when: (answers) => answers[Names.SONARQUBE],
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
        default: true,
      },
    ]);
    this.answers = { ...defaultAnswers, ...answers };
    if (answers[Names.WITH_LICENSE]) {
      try {
        const licenses = await getLicenses();
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
        console.log('Error while fetching licenses, skipping...');
      }
    }
  }

  writing(): void {
    [
      Filenames.TS_CONFIG,
      Filenames.NODEMON_CONFIG,
      Filenames.GIT_IGNORE,
      Filenames.SRC_FOLDER,
      Filenames.README,
    ].forEach((fileName: Filenames) => {
      this.fs.copy(this.templatePath(fileName), this.destinationPath(fileName));
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
      license: 'MIT',
      devDependencies: {
        '@types/node': rootPkg.devDependencies['@types/node'],
        nodemon: '^2.0.4',
        rimraf: '^3.0.2',
        'ts-node': '^8.10.2',
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
      this.composeWith(require.resolve('../sonarqube'), {
        token: this.answers[Names.SONARQUBE_TOKEN],
      });
    }

    if (this.answers[Names.LINT_STAGED]) {
      this.composeWith(require.resolve('../lint-staged'), {
        withPrettier: withFeature(this.answers, Features.PRETTIER),
      });
    }

    if (this.answers[Names.WITH_LICENSE]) {
      this.composeWith(require.resolve('../license'), {
        license: this.answers.license,
      });
    }
  }

  install(): void {
    this.npmInstall();
  }
}
