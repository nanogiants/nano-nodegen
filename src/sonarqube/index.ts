import path from 'path';
import Generator, { Answers } from 'yeoman-generator';

import { Filenames } from '../lib/enums/filenames';
import { Messages } from '../lib/enums/messages';
import { Names } from '../lib/enums/names';

module.exports = class extends Generator {
  answers!: Answers;

  async prompting(): Promise<void> {
    this.answers = await this.prompt({
      type: 'confirm',
      name: Names.SONARQUBE,
      message: Messages.SONARQUBE,
      default: false,
    });
  }

  writing() {
    if (this.answers[Names.SONARQUBE]) {
      this.fs.append(this.destinationPath(Filenames.README), this.fs.read(this.templatePath(Filenames.README)));

      [Filenames.SONARQUBE_PROPERTIES, Filenames.DOCKER_COMPOSE].forEach((filename: Filenames) => {
        this.fs.copy(this.templatePath(filename), this.destinationPath(filename));
      });

      this.fs.copyTpl(
        this.templatePath(Filenames.SONARQUBE_REPORT_SCRIPT),
        this.destinationPath(path.join(Filenames.SRIPTS_FOLDER, Filenames.SONARQUBE_REPORT_SCRIPT)),
      );

      this.fs.extendJSON(this.destinationPath(Filenames.PACKAGE_JSON), {
        scripts: {
          'sonarqube:start': 'docker-compose up -d',
          'sonarqube:stop': 'docker-compose down',
          'sonarqube:report': 'sh scripts/report_sonarqube.sh -k',
        },
      });
    }
  }
};
