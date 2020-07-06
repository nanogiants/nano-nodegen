# nano-nodegen
This package contains a yeoman generator for scaffolding node apps with typescript support.

## Usage

```bash
npm i -g yo
npm i -g @nanogiants/nano-nodegen
yo nano-node-gen
```

These commands will prompt you with some questions from which your project gets bootstrapped.

## Features

### Eslint
Enables linting with predefined config.
See more at [eslint](https://www.npmjs.com/package/eslint).

#### Husky and Lint-Staged
If this feature gets selected you will also be asked if you want to install commit hooks with [husky](https://www.npmjs.com/package/husky) and lint your files while staging with [lint-staged](https://www.npmjs.com/package/lint-staged).


### Prettier
Enables codeformatting with [prettier](https://www.npmjs.com/package/prettier).

### Jest
Enables testing your code with [jest](https://jestjs.io/).

#### Sonarqube
If this feature gets selected you will also be asked if you want to configure [sonarqube](https://www.sonarqube.org/). If `yes`  your project will setup a `docker-compose.yml` file and a few scripts to get started.
