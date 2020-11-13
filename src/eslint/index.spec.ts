/* eslint-disable @typescript-eslint/ban-ts-comment */
import assert from 'yeoman-assert';

import { Features } from '../lib/enums/features';
import { Filenames } from '../lib/enums/filenames';
import { Names } from '../lib/enums/names';
import rootPkg from '../lib/helpers/package';
import { runBaseGenerator } from '../lib/test/helpers';

describe('eslint', () => {
  describe('given eslint selected', () => {
    it('should create eslint files and dependencies', async () => {
      await runBaseGenerator({
        [Names.FEATURES]: [Features.ESLINT],
      });

      assert.file(Filenames.ESLINT_CONFIG);

      assert.jsonFileContent(Filenames.PACKAGE_JSON, {
        devDependencies: {
          '@typescript-eslint/eslint-plugin': rootPkg.devDependencies['@typescript-eslint/eslint-plugin'],
          '@typescript-eslint/parser': rootPkg.devDependencies['@typescript-eslint/parser'],
          eslint: rootPkg.devDependencies.eslint,
          'eslint-plugin-import': rootPkg.devDependencies['eslint-plugin-import'],
        },
      });
    });
  });
  describe('given eslint not selected', () => {
    it('should not create eslint files and dependencies', async () => {
      await runBaseGenerator({
        [Names.FEATURES]: [],
      });

      assert.noFile(Filenames.ESLINT_CONFIG);

      assert.noJSONFileContent(Filenames.PACKAGE_JSON, {
        devDependencies: {
          '@typescript-eslint/eslint-plugin': rootPkg.devDependencies['@typescript-eslint/eslint-plugin'],
          '@typescript-eslint/parser': rootPkg.devDependencies['@typescript-eslint/parser'],
          eslint: rootPkg.devDependencies.eslint,
          'eslint-plugin-import': rootPkg.devDependencies['eslint-plugin-import'],
        },
      });
    });
  });
});
