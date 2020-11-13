import chalk from "chalk";
import Generator from "yeoman-generator";

import { Filenames } from "../lib/enums/filenames";
import { GithubClient } from "../lib/helpers/github.client";

interface Config {
  license: string;
}
module.exports = class extends Generator {
  license: string;
  constructor(args: string | string[], config: Config) {
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
      chalk.yellow("Error while fetching license, skipping...");
    }

    this.fs.extendJSON(this.destinationPath(Filenames.PACKAGE_JSON), {
      license: this.license,
    });
  }
};
