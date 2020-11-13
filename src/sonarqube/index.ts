import path from 'path';
import Generator from 'yeoman-generator';

import { Filenames } from '../lib/enums/filenames';

module.exports = class extends Generator {
  writing() {
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
};
