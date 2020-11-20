/* eslint-disable @typescript-eslint/ban-ts-comment */
import path from 'path';
import assert from 'yeoman-assert';

import { Features } from '../lib/enums/features';
import { Filenames } from '../lib/enums/filenames';
import { Names } from '../lib/enums/names';
import { runBaseGenerator } from '../lib/test/helpers';

describe('sonarqube', () => {
  describe('given sonarqube selected', () => {
    it('should create sonarqube files and dependencies', async () => {
      await runBaseGenerator({
        [Names.FEATURES]: [Features.JEST],
        [Names.SONARQUBE]: true,
      });

      assert.file(Filenames.SONARQUBE_PROPERTIES);
      assert.file(Filenames.DOCKER_COMPOSE);
      assert.file(path.join(Filenames.SRIPTS_FOLDER, Filenames.SONARQUBE_REPORT_SCRIPT));
      assert.fileContent(Filenames.README, '### Sonarqube');
      assert.jsonFileContent(Filenames.PACKAGE_JSON, {
        scripts: {
          'sonarqube:start': 'docker-compose up -d',
          'sonarqube:stop': 'docker-compose down',
          'sonarqube:report': 'sh scripts/report_sonarqube.sh -k',
        },
      });
    });
  });
  describe('given sonarqube not selected', () => {
    it('should not create sonarqube files and dependencies', async () => {
      await runBaseGenerator({
        [Names.FEATURES]: [Features.JEST],
        [Names.SONARQUBE]: false,
      });

      assert.noFile(Filenames.SONARQUBE_PROPERTIES);
      assert.noFile(Filenames.DOCKER_COMPOSE);
      assert.noFile(path.join(Filenames.SRIPTS_FOLDER, Filenames.SONARQUBE_REPORT_SCRIPT));

      assert.noJSONFileContent(Filenames.PACKAGE_JSON, {
        scripts: {
          'sonarqube:start': 'docker-compose up -d',
          'sonarqube:stop': 'docker-compose down',
          'sonarqube:report': 'sh scripts/report_sonarqube.sh -k',
        },
      });
    });
  });
});
