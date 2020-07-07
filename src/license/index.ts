import Generator from 'yeoman-generator';

import { Filenames } from '../lib/enums/filenames';
import { getLicense } from '../lib/helpers';

module.exports = class extends Generator {
  license: string;
  constructor(args: string | string[], config: any) {
    super(args, config);
    this.license = config.license;
  }

  async writing() {
    const licenseContent = await getLicense(this.license);
    this.fs.copyTpl(
      this.templatePath(Filenames.LICENSE),
      this.destinationPath(Filenames.LICENSE),
      { license: licenseContent }
    );
  }
};
