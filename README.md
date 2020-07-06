# nano-nodegen
This package contains a yeoman generator for scaffolding node apps with typescript support.

## Usage

```bash
npm i -g yo
npm i -g @nanogiants/nano-nodegen
yo nano-nodegen
```

These commands will prompt you with some questions from which your project gets bootstrapped.

## Features

### Eslint
Enables linting with predefined config.
See more at [eslint](https://www.npmjs.com/package/eslint).

#### Husky and Lint-Staged
If eslint gets selected you will also be asked if you want to install commit hooks with [husky](https://www.npmjs.com/package/husky) and lint your files while staging with [lint-staged](https://www.npmjs.com/package/lint-staged).


### Prettier
Enables codeformatting with [prettier](https://www.npmjs.com/package/prettier).

### Jest
Enables testing your code with [jest](https://jestjs.io/).
To test your files run 
```bash
npm run test
```
or
```
npm run test:cov # also creates coverage file to report to sonarqube
```

#### Sonarqube
If jest gets selected you will also be asked if you want to configure [sonarqube](https://www.sonarqube.org/). If `yes`  your project will setup a `docker-compose.yml` file and a few scripts to get started.

To start sonarqube run
```bash
npm run sonarqube:start
```

To stop sonarqube run
```bash
npm run sonarqube:stop
```

To report your testcoverage just run 
```bash
npm run sonarqube:report YOUR_KEY
```
or
```bash
sh ./scripts/report_sonarqube.sh -k YOUR_KEY
```
