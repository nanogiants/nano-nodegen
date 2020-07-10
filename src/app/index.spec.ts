// import path from 'path';
import path from 'path';
import assert from 'yeoman-assert';
import { Answers } from 'yeoman-generator';
import helpers from 'yeoman-test';

import { Features } from '../lib/enums/features';
import { Filenames } from '../lib/enums/filenames';
import { Names } from '../lib/enums/names';
import rootPkg from '../lib/helpers/package';

const run = async (prompts: Answers, skipNpmInstall = true) => {
  return helpers.run(__dirname).withPrompts(prompts).withOptions({
    skipInstall: skipNpmInstall,
  });
};

const defaultFiles = [
  Filenames.TS_CONFIG,
  `.${Filenames.GIT_IGNORE}`,
  Filenames.PACKAGE_JSON,
  Filenames.SRC_FOLDER,
  Filenames.NODEMON_CONFIG,
];

describe('app', () => {
  describe('given no features selected', () => {
    it('should generate empty project and install modules', async () => {
      await run(
        {
          [Names.PROJECT_NAME]: 'hans',
          [Names.AUTHOR]: 'r.heinen@nanogiants.de',
        },
        false
      );

      assert.file(defaultFiles);
      assert.jsonFileContent(Filenames.PACKAGE_JSON, {
        author: 'r.heinen@nanogiants.de',
      });
      assert.jsonFileContent(Filenames.PACKAGE_JSON, {
        name: 'hans',
      });
      assert.file('node_modules');
    }, 30000);
  });
  describe('given eslint selected', () => {
    it('should create eslint files and dependencies', async () => {
      await run({
        [Names.PROJECT_NAME]: 'hans',
        [Names.AUTHOR]: 'r.heinen@nanogiants.de',
        [Names.FEATURES]: [Features.ESLINT],
        [Names.LINT_STAGED]: false,
      });

      assert.file(defaultFiles);
      assert.file(Filenames.ESLINT_CONFIG);

      assert.jsonFileContent(Filenames.PACKAGE_JSON, {
        devDependencies: {
          '@typescript-eslint/eslint-plugin':
            rootPkg.devDependencies['@typescript-eslint/eslint-plugin'],
          '@typescript-eslint/parser':
            rootPkg.devDependencies['@typescript-eslint/parser'],
          eslint: rootPkg.devDependencies.eslint,
          'eslint-plugin-import':
            rootPkg.devDependencies['eslint-plugin-import'],
        },
      });
    });
  });

  describe('given prettier selected', () => {
    it('should create prettier files and dependencies', async () => {
      await run({
        [Names.PROJECT_NAME]: 'hans',
        [Names.AUTHOR]: 'r.heinen@nanogiants.de',
        [Names.FEATURES]: [Features.PRETTIER],
      });

      assert.file(defaultFiles);
      assert.file(Filenames.PRETTIER_CONFIG);

      assert.jsonFileContent(Filenames.PACKAGE_JSON, {
        devDependencies: {
          prettier: rootPkg.devDependencies.prettier,
        },
      });
    });
  });

  describe('given jest selected', () => {
    it('should create jest files and dependencies', async () => {
      await run({
        [Names.PROJECT_NAME]: 'hans',
        [Names.AUTHOR]: 'r.heinen@nanogiants.de',
        [Names.FEATURES]: [Features.JEST],
      });

      assert.file(defaultFiles);
      assert.file(Filenames.JEST_CONFIG);
      assert.file(path.join(Filenames.SRC_FOLDER, 'lib', Filenames.JEST_TEST));

      assert.jsonFileContent(Filenames.PACKAGE_JSON, {
        scripts: {
          test: 'jest --runInBand',
          'test:cov': 'jest --coverage --runInBand',
        },
        devDependencies: {
          '@types/jest': rootPkg.devDependencies['@types/jest'],
          jest: rootPkg.devDependencies.jest,
          'ts-jest': rootPkg.devDependencies['ts-jest'],
        },
      });
    });
  });

  describe('given sonarqube selected', () => {
    it('should create sonarqube files and dependencies', async () => {
      await run({
        [Names.PROJECT_NAME]: 'hans',
        [Names.AUTHOR]: 'r.heinen@nanogiants.de',
        [Names.FEATURES]: [Features.JEST],
        [Names.SONARQUBE]: true,
      });

      assert.file(defaultFiles);
      assert.file(Filenames.SONARQUBE_PROPERTIES);
      assert.file(Filenames.DOCKER_COMPOSE);
      assert.file(
        path.join(Filenames.SRIPTS_FOLDER, Filenames.SONARQUBE_REPORT_SCRIPT)
      );

      assert.jsonFileContent(Filenames.PACKAGE_JSON, {
        scripts: {
          'sonarqube:start': 'docker-compose up -d',
          'sonarqube:stop': 'docker-compose down',
          'sonarqube:report': 'sh scripts/report_sonarqube.sh',
        },
      });
    });
  });

  describe('given lint-staged selected', () => {
    describe('given prettier not selected', () => {
      it('should create lint-staged config', async () => {
        await run({
          [Names.PROJECT_NAME]: 'hans',
          [Names.AUTHOR]: 'r.heinen@nanogiants.de',
          [Names.FEATURES]: [Features.ESLINT],
          [Names.LINT_STAGED]: true,
        });

        assert.file(defaultFiles);
        assert.file(Filenames.ESLINT_CONFIG);

        assert.jsonFileContent(Filenames.PACKAGE_JSON, {
          'lint-staged': {
            'src/**/*.{js,ts}': ['eslint . --fix', 'git add'],
          },
        });
        assert.jsonFileContent(Filenames.PACKAGE_JSON, {
          husky: {
            hooks: {
              'pre-commit': 'lint-staged',
            },
          },
        });
      });
    });

    describe('given prettier also selected', () => {
      it('should create lint-staged config', async () => {
        await run({
          [Names.PROJECT_NAME]: 'hans',
          [Names.AUTHOR]: 'r.heinen@nanogiants.de',
          [Names.FEATURES]: [Features.ESLINT, Features.PRETTIER],
          [Names.LINT_STAGED]: true,
        });

        assert.file(defaultFiles);
        assert.file(Filenames.ESLINT_CONFIG);

        assert.jsonFileContent(Filenames.PACKAGE_JSON, {
          'lint-staged': {
            'src/**/*.{js,ts}': [
              'eslint . --fix',
              'prettier --write',
              'git add',
            ],
          },
        });
        assert.jsonFileContent(Filenames.PACKAGE_JSON, {
          husky: {
            hooks: {
              'pre-commit': 'lint-staged',
            },
          },
        });
      });
    });
  });
});
