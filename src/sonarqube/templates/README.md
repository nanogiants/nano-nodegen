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
