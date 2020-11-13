import assert from 'yeoman-assert';
import helpers from 'yeoman-test';

import { Filenames } from '../lib/enums/filenames';
import rootPkg from '../lib/helpers/package';

describe('prettier', () => {
  it('should create prettier files and dependencies', async () => {
    await helpers.run(__dirname);

    assert.file(Filenames.PRETTIER_CONFIG);

    assert.jsonFileContent(Filenames.PACKAGE_JSON, {
      devDependencies: {
        prettier: rootPkg.devDependencies.prettier,
      },
    });
  });
});
