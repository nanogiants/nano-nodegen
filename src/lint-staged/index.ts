import Generator from "yeoman-generator";

import { Filenames } from "../lib/enums/filenames";
import rootPkg from "../lib/helpers/package";

module.exports = class extends Generator {
  withPrettier = false;
  constructor(args: string | string[], config: any) {
    super(args, config);
    this.withPrettier = config.withPrettier;
  }

  writing() {
    const lintStagedCommands = ["eslint . --fix", "git add"];

    // add prettier command to lint-staged
    if (this.withPrettier) {
      lintStagedCommands.splice(1, 0, "prettier --write");
    }

    this.fs.extendJSON(this.destinationPath(Filenames.PACKAGE_JSON), {
      devDependencies: {
        husky: rootPkg.devDependencies.husky,
        "lint-staged": rootPkg.devDependencies["lint-staged"],
      },
      "lint-staged": {
        "src/**/*.{js,ts}": lintStagedCommands,
      },
      husky: {
        hooks: {
          "pre-commit": "lint-staged",
        },
      },
    });
  }
};
