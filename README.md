# nano-nodegen
This package contains a yeoman generator for scaffolding node apps with typescript support.

## Usage

```bash
npm i -g yo
npm i -g @nanogiants/generator-nano-nodegen
yo @nanogiants/nano-nodegen
```

These commands will prompt you with some questions from which your project gets bootstrapped.

## Features

### Filetree when selecting all options

```bash
├── .eslintrc.js # eslint config
├── .gitignore # files ignored by git
├── .prettierrc.js # prettier config
├── LICENSE.md
├── README.md
├── docker-compose.yml # compose file for sonarqube and postgress containers
├── jest.config.js # config for your jest testing library
├── nodemon.json # config for your filewatcher
├── package-lock.json
├── package.json # your projects package setup
├── scripts
│   └── report_sonarqube.sh # helper script to report to sonarqube
├── sonar-project.properties # sonarqube configuration file
├── src
│   ├── index.ts # your apps entry point
│   └── lib # your apps logic
│       ├── hello.spec.ts # a sample test file
│       └── hello.ts # a sample ts file
└── tsconfig.json # the typescript configuration file
```

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

## Contributing

To contribute please fork the repository, create a new branch to make changes on and create a pull request into the develop branch of this repository.  
Remember to write tests (if needed) to get the features approved.

## Feature Requests

For feature requests please use the issuetracker and specify your exact needs. 

## License

[MIT](https://github.com/nanogiants/nano-nodegen/blob/develop/LICENSE.md)