import Generator from 'yeoman-generator';

import { Filenames } from '../lib/enums/filenames';
import { GithubClient } from '../lib/helpers/github.client';

module.exports = class extends Generator {
  license: string;
  constructor(args: string | string[], config: any) {
    super(args, config);
    this.license = config.license;
  }

  async writing() {
    try {
      const licenseContent = await GithubClient.getLicense(this.license);
      this.fs.copyTpl(
        this.templatePath(Filenames.LICENSE),
        this.destinationPath(Filenames.LICENSE),
        { license: licenseContent }
      );
    } catch (error) {
      console.log('Error while fetching license, skipping...')
    }

    this.fs.extendJSON(this.destinationPath(Filenames.PACKAGE_JSON), {
      license: this.license,
    });
  }
};
