import path from 'path';
import Generator from 'yeoman-generator';

import { Filenames } from '../../enums/filenames';
import { Names } from '../../enums/names';

interface IConfig {
  token: string | null;
}

export const createSonarqube = (ctx: Generator, config: IConfig): void => {
  const { token } = config;
  ctx.fs.copy(
    ctx.templatePath(
      path.join(Names.SONARQUBE, Filenames.SONARQUBE_PROPERTIES)
    ),
    ctx.destinationPath(Filenames.SONARQUBE_PROPERTIES)
  );
  ctx.fs.copy(
    ctx.templatePath(path.join(Names.SONARQUBE, Filenames.DOCKER_COMPOSE)),
    ctx.destinationPath(Filenames.DOCKER_COMPOSE)
  );
  ctx.fs.copyTpl(
    ctx.templatePath(
      path.join(Names.SONARQUBE, Filenames.SONARQUBE_REPORT_SCRIPT)
    ),
    ctx.destinationPath(
      path.join(Filenames.SRIPTS_FOLDER, Filenames.SONARQUBE_REPORT_SCRIPT)
    ),
    { token }
  );

  ctx.fs.extendJSON(ctx.destinationPath(Filenames.PACKAGE_JSON), {
    scripts: {
      'sonarqube:start': 'docker-compose up -d',
      'sonarqube:stop': 'docker-compose down',
      'sonarqube:report': 'sh scripts/report_sonarqube.sh',
    },
  });
};
