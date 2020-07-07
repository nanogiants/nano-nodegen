# Node Starter

## Getting Started

Run your app in development mode
```bash
npm run start:dev
```

Build your app
```bash
npm run build
```

### Jest

Jest enables you to unittest your code and generate coverage files

To test your files run 
```bash
npm run test
npm run test:cov # also creates coverage files to report to sonarqube
```

### Husky and Lint-Staged
[husky](https://www.npmjs.com/package/husky) and [lint-staged](https://www.npmjs.com/package/lint-staged) will lint and format your files while committing. It will abort if there are remaining linting errors. This keeps your git clean from malformed code.



### Sonarqube
With [sonarqube](https://www.sonarqube.org/) you get some metrics about your code.  
For example the code coverage, the technical debt, best practises and many more

To start sonarqube run
```bash
npm run sonarqube:start
```
and visit [the local server](http://localhost:9000/).
The default credentials are `admin:admin`.

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