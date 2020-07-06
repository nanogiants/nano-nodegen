import Generator from 'yeoman-generator';

import { Features } from '../enums/features';
import { Messages } from '../enums/messages';
import { Names } from '../enums/names';
import { withFeature } from '../helpers';

import { createBase } from './lib/common';
import { createEslint } from './lib/eslint';
import { createJest } from './lib/jest';
import { createLintStaged } from './lib/lintStaged';
import { createPrettier } from './lib/prettier';
import { createSonarqube } from './lib/sonarqube';

interface Answers {
  [Names.PROJECT_NAME]: string;
  [Names.AUTHOR]: string;
  [Names.FEATURES]: Features[];
  [Names.SONARQUBE]: boolean;
  [Names.LINT_STAGED]: boolean;
  [Names.SONARQUBE_TOKEN]: string | null;
}

const defaultAnswers: Answers = {
  [Names.PROJECT_NAME]: Names.PROJECT_NAME,
  [Names.AUTHOR]: Names.AUTHOR,
  [Names.FEATURES]: [],
  [Names.SONARQUBE]: false,
  [Names.LINT_STAGED]: false,
  [Names.SONARQUBE_TOKEN]: null,
};

export default class extends Generator {
  answers: Answers = defaultAnswers;
  async prompting(): Promise<void> {
    const answers = await this.prompt([
      {
        type: 'input',
        name: Names.PROJECT_NAME,
        message: Messages.PROJECT_NAME,
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
        default: defaultAnswers['sonarqube-token'],
        when: (answers) => answers[Names.SONARQUBE],
      },
      {
        type: 'confirm',
        name: Names.LINT_STAGED,
        message: Messages.LINT_STAGED,
        default: defaultAnswers['lint-staged'],
        when: (answers) => withFeature(answers, Features.ESLINT),
      },
    ]);
    this.answers = answers;
    // console.log({ answers });
  }

  writing(): void {
    createBase(this, {
      title: this.answers.projectname,
      author: this.answers.author,
    });

    if (withFeature(this.answers, Features.ESLINT)) {
      createEslint(this);
    }
    if (withFeature(this.answers, Features.PRETTIER)) {
      createPrettier(this);
    }

    if (withFeature(this.answers, Features.JEST)) {
      createJest(this);
    }

    if (this.answers[Names.SONARQUBE]) {
      createSonarqube(this, { token: this.answers[Names.SONARQUBE_TOKEN] });
    }

    if (this.answers[Names.LINT_STAGED]) {
      createLintStaged(this, {
        withPrettier: withFeature(this.answers, Features.PRETTIER),
      });
    }
  }

  install(): void {
    this.npmInstall();
  }
}
