import Generator from "yeoman-generator";

import { Filenames } from "../lib/enums/filenames";
import rootPkg from "../lib/helpers/package";

module.exports = class extends Generator {
  writing() {
    const pkgJson = {
      scripts: {
        changelog: "conventional-changelog -p angular -i CHANGELOG.md -s",
      },
      devDependencies: {
        "conventional-changelog-cli":
          rootPkg.devDependencies["conventional-changelog-cli"],
      },
    };

    this.fs.extendJSON(this.destinationPath(Filenames.PACKAGE_JSON), pkgJson);
  }
};
