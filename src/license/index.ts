import chalk from 'chalk';
import Generator, { Answers } from 'yeoman-generator';

import { Filenames } from '../lib/enums/filenames';
import { Messages } from '../lib/enums/messages';
import { Names } from '../lib/enums/names';
import { GithubClient } from '../lib/helpers/github.client';

module.exports = class extends Generator {
  answers!: Answers;

  async prompting(): Promise<void> {
    this.answers = await this.prompt({
      type: 'confirm',
      name: Names.WITH_LICENSE,
      message: Messages.WITH_LICENSE,
      default: true,
    });
    if (this.answers[Names.WITH_LICENSE]) {
      try {
        const licenses = await GithubClient.getLicenses();
        const licenseAnswer = await this.prompt([
          {
            type: 'list',
            name: Names.LICENSE,
            message: Messages.LICENSE,
            default: 'mit',
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
  }

  async writing() {
    if (this.answers[Names.WITH_LICENSE]) {
      try {
        const licenseContent = await GithubClient.getLicense(this.answers[Names.LICENSE]);
        this.fs.copyTpl(this.templatePath(Filenames.LICENSE), this.destinationPath(Filenames.LICENSE), {
          license: licenseContent,
        });
      } catch (error) {
        chalk.yellow('Error while fetching license, skipping...');
      }

      this.fs.extendJSON(this.destinationPath(Filenames.PACKAGE_JSON), {
        license: this.answers[Names.LICENSE],
      });
    }
  }
};
