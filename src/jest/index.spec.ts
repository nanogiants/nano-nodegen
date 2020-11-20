/* eslint-disable @typescript-eslint/ban-ts-comment */
import path from 'path';
import assert from 'yeoman-assert';

import { Features } from '../lib/enums/features';
import { Filenames } from '../lib/enums/filenames';
import { Names } from '../lib/enums/names';
import rootPkg from '../lib/helpers/package';
import { runBaseGenerator } from '../lib/test/helpers';

describe('jest', () => {
  describe('given jest selected', () => {
    it('should create jest files and dependencies', async () => {
      await runBaseGenerator({
        [Names.FEATURES]: [Features.JEST],
      });

      assert.file(Filenames.JEST_CONFIG);
      assert.file(path.join(Filenames.SRC_FOLDER, 'lib', Filenames.JEST_TEST));
      assert.fileContent(Filenames.README, '### Jest');

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
  describe('given jest not selected', () => {
    it('should not create jest files and dependencies', async () => {
      await runBaseGenerator({
        [Names.FEATURES]: [],
      });

      assert.noFile(Filenames.JEST_CONFIG);
      assert.noFile(path.join(Filenames.SRC_FOLDER, 'lib', Filenames.JEST_TEST));

      assert.noJSONFileContent(Filenames.PACKAGE_JSON, {
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
});
