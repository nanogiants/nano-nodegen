/* eslint-disable @typescript-eslint/ban-ts-comment */
import assert from 'yeoman-assert';

import { Features } from '../lib/enums/features';
import { Filenames } from '../lib/enums/filenames';
import { Names } from '../lib/enums/names';
import { runBaseGenerator } from '../lib/test/helpers';

describe('lint-staged', () => {
  describe('given lint-staged selected', () => {
    describe('given prettier not selected', () => {
      it('should create lint-staged config', async () => {
        await runBaseGenerator({
          [Names.FEATURES]: [Features.ESLINT],
          [Names.LINT_STAGED]: true,
        });

        assert.file(Filenames.ESLINT_CONFIG);
        assert.fileContent(Filenames.README, '### Husky and Lint-Staged');
        assert.jsonFileContent(Filenames.PACKAGE_JSON, {
          'lint-staged': {
            'src/**/*.{js,ts}': ['eslint . --fix', 'git add'],
          },
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
        await runBaseGenerator({
          [Names.FEATURES]: [Features.ESLINT, Features.PRETTIER],
          [Names.LINT_STAGED]: true,
        });

        assert.file(Filenames.ESLINT_CONFIG);
        assert.fileContent(Filenames.README, '### Husky and Lint-Staged');
        assert.jsonFileContent(Filenames.PACKAGE_JSON, {
          'lint-staged': {
            'src/**/*.{js,ts}': ['eslint . --fix', 'prettier --write', 'git add'],
          },
          husky: {
            hooks: {
              'pre-commit': 'lint-staged',
            },
          },
        });
      });
    });
  });
  describe('given lint-staged not selected', () => {
    it('should not create lint-staged config', async () => {
      await runBaseGenerator({
        [Names.FEATURES]: [Features.ESLINT],
        [Names.LINT_STAGED]: false,
      });

      assert.file(Filenames.ESLINT_CONFIG);

      assert.noJSONFileContent(Filenames.PACKAGE_JSON, {
        'lint-staged': 'somevalue',
        husky: 'somevalue',
      });
    });
  });
});
