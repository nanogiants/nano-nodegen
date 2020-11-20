/* eslint-disable @typescript-eslint/ban-ts-comment */
import assert from 'yeoman-assert';

import { Filenames } from '../lib/enums/filenames';
import { Names } from '../lib/enums/names';
import { runBaseGenerator } from '../lib/test/helpers';

describe('changelog', () => {
  describe('given changelog selected', () => {
    it('should create changelog script', async () => {
      await runBaseGenerator({
        [Names.CHANGELOG]: true,
      });

      assert.fileContent(Filenames.README, '### Changelog');

      assert.JSONFileContent(Filenames.PACKAGE_JSON, {
        scripts: {
          'init-changelog': 'conventional-changelog -p angular -i CHANGELOG.md -s -r 0',
          version: 'conventional-changelog -p angular -i CHANGELOG.md -s && git add CHANGELOG.md',
        },
      });
    });
  });

  describe('given changelog not selected', () => {
    it('should not create changelog script', async () => {
      await runBaseGenerator({
        [Names.CHANGELOG]: false,
      });
      assert.noJSONFileContent(Filenames.PACKAGE_JSON, {
        scripts: {
          'init-changelog': 'conventional-changelog -p angular -i CHANGELOG.md -s -r 0',
          version: 'conventional-changelog -p angular -i CHANGELOG.md -s && git add CHANGELOG.md',
        },
      });
    });
  });
});
